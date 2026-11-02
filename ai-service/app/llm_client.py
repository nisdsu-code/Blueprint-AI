import json
import logging
from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from app import config

T = TypeVar("T", bound=BaseModel)

logger = logging.getLogger("blueprintgen.ai")

MAX_ATTEMPTS = 2
LOG_SNIPPET_CHARS = 300


class LLMError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


def _snippet(text: str) -> str:
    return text[-LOG_SNIPPET_CHARS:].replace("\n", "\\n")


def _summarize_validation_errors(exc: ValidationError) -> str:
    return "; ".join(
        f"{'.'.join(str(part) for part in error['loc'])}: {error['msg']}" for error in exc.errors()[:5]
    )


async def _request_completion(system_prompt: str, user_prompt: str) -> str:
    provider = config.LLM_PROVIDER
    payload = {
        "model": config.LLM_MODEL,
        "temperature": 0.2,
        "max_tokens": config.LLM_MAX_OUTPUT_TOKENS,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    headers = {"Authorization": f"Bearer {config.LLM_API_KEY}"}

    try:
        async with httpx.AsyncClient(timeout=config.LLM_TIMEOUT_SECONDS) as client:
            response = await client.post(f"{config.LLM_BASE_URL}/chat/completions", json=payload, headers=headers)
    except httpx.HTTPError as exc:
        logger.error("model_error: could not reach %s (%s)", provider, type(exc).__name__)
        raise LLMError("Could not reach the AI provider. Please try again shortly.", 503) from exc

    if response.status_code == 429:
        logger.warning("model_error: %s rate limit reached (HTTP 429)", provider)
        raise LLMError("The AI provider rate limit was reached. Please wait a moment and try again.", 429)
    if response.status_code >= 400:
        logger.error("model_error: %s returned HTTP %s: %s", provider, response.status_code, _snippet(response.text))
        raise LLMError("The AI provider rejected the request. Please try again later.", 502)

    try:
        choice = response.json()["choices"][0]
        content = choice["message"]["content"]
        finish_reason = choice.get("finish_reason")
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        logger.error("model_error: unexpected response shape from %s: %s", provider, _snippet(response.text))
        raise LLMError("The AI provider returned an unexpected response.", 502) from exc

    if finish_reason == "length":
        logger.error(
            "truncation: %s stopped at max_tokens=%s after %s characters; raise LLM_MAX_OUTPUT_TOKENS if this persists",
            provider,
            config.LLM_MAX_OUTPUT_TOKENS,
            len(content or ""),
        )
        raise LLMError("The AI response was too long to finish. Please try again with a shorter requirement.", 502)
    if not isinstance(content, str) or not content.strip():
        logger.error("model_error: %s returned empty content (finish_reason=%s)", provider, finish_reason)
        raise LLMError("The AI returned an empty response. Please try again.", 502)

    return content


def _parse_object(content: str, attempt: int) -> dict | None:
    try:
        data = json.loads(content)
    except json.JSONDecodeError as exc:
        logger.error(
            "json_parse_error attempt=%s: %s (line %s, column %s); response length=%s; tail=%s",
            attempt,
            exc.msg,
            exc.lineno,
            exc.colno,
            len(content),
            _snippet(content),
        )
        return None

    if not isinstance(data, dict):
        logger.error("json_parse_error attempt=%s: top-level value is not a JSON object", attempt)
        return None
    return data


async def request_structured(model_cls: type[T], system_prompt: str, user_prompt: str) -> T:
    for attempt in range(1, MAX_ATTEMPTS + 1):
        content = await _request_completion(system_prompt, user_prompt)

        data = _parse_object(content, attempt)
        if data is None:
            continue

        try:
            result = model_cls.model_validate(data)
        except ValidationError as exc:
            logger.error(
                "schema_validation attempt=%s model=%s: %s",
                attempt,
                model_cls.__name__,
                _summarize_validation_errors(exc),
            )
            continue

        logger.info("%s succeeded on attempt %s", model_cls.__name__, attempt)
        return result

    raise LLMError("The AI returned an incomplete or malformed result. Please try again.", 502)

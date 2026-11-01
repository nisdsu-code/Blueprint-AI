from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from app import config

T = TypeVar("T", bound=BaseModel)

MAX_ATTEMPTS = 2


class LLMError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


async def request_json_completion(system_prompt: str, user_prompt: str) -> str:
    payload = {
        "model": config.LLM_MODEL,
        "temperature": 0.2,
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
        raise LLMError("Could not reach the AI provider. Please try again shortly.", 503) from exc

    if response.status_code == 429:
        raise LLMError("The AI provider rate limit was reached. Please wait a moment and try again.", 429)
    if response.status_code >= 400:
        raise LLMError("The AI provider rejected the request. Please try again later.", 502)

    try:
        return response.json()["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise LLMError("The AI provider returned an unexpected response.", 502) from exc


async def request_structured(model_cls: type[T], system_prompt: str, user_prompt: str) -> T:
    for _ in range(MAX_ATTEMPTS):
        raw_output = await request_json_completion(system_prompt, user_prompt)
        try:
            return model_cls.model_validate_json(raw_output)
        except ValidationError:
            continue
    raise LLMError("The AI returned an incomplete result. Please try again.", 502)

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

PROVIDERS = {
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "key_env": "OPENAI_API_KEY",
        "default_model": "gpt-4o-mini",
    },
    "gemini": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai",
        "key_env": "GEMINI_API_KEY",
        "default_model": "gemini-2.5-flash",
    },
    "groq": {
        "base_url": "https://api.groq.com/openai/v1",
        "key_env": "GROQ_API_KEY",
        "default_model": "llama-3.3-70b-versatile",
    },
}

SERVICE_TOKEN = os.getenv("AI_SERVICE_TOKEN", "").strip()
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").strip().lower()

if LLM_PROVIDER not in PROVIDERS:
    raise RuntimeError(f"LLM_PROVIDER must be one of {', '.join(PROVIDERS)} (got '{LLM_PROVIDER}')")

_provider = PROVIDERS[LLM_PROVIDER]
LLM_BASE_URL = _provider["base_url"]
LLM_API_KEY = os.getenv(_provider["key_env"], "").strip()
LLM_MODEL = os.getenv("LLM_MODEL", "").strip() or _provider["default_model"]
LLM_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "60"))
LLM_MAX_OUTPUT_TOKENS = int(os.getenv("LLM_MAX_OUTPUT_TOKENS", "8192"))

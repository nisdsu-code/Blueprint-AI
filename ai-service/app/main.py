from fastapi import Depends, FastAPI, Header, HTTPException

from app import config
from app.analysis_service import analyze_requirement
from app.blueprint_service import generate_blueprint
from app.llm_client import LLMError
from app.schemas import AnalyzeRequest, AnalyzeResponse, BlueprintRequest, BlueprintResponse

app = FastAPI(title="BlueprintGen AI Service", version="0.1.0")


def verify_service_token(x_service_token: str | None = Header(default=None)) -> None:
    if not config.SERVICE_TOKEN or x_service_token != config.SERVICE_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid service token")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "mode": "live" if config.LLM_API_KEY else "demo", "provider": config.LLM_PROVIDER}


@app.post("/analyze", response_model=AnalyzeResponse, dependencies=[Depends(verify_service_token)])
async def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    try:
        return await analyze_requirement(payload)
    except LLMError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc


@app.post("/blueprint", response_model=BlueprintResponse, dependencies=[Depends(verify_service_token)])
async def blueprint(payload: BlueprintRequest) -> BlueprintResponse:
    try:
        return await generate_blueprint(payload)
    except LLMError as exc:
        raise HTTPException(status_code=exc.status_code, detail=str(exc)) from exc

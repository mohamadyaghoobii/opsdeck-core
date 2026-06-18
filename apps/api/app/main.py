import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes import router
from app.core.settings import get_settings
from app.db.session import SessionLocal, init_db
from app.schemas.entities import HealthOut, ReadyOut
from app.services.seed import seed_database

logger = logging.getLogger("opsdeck")
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    if settings.seed_on_startup:
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    logger.info("OpsDeck API started in %s mode", settings.app_env)
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    summary="Control plane API for the OpsDeck DevOps and DevSecOps platform.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health", response_model=HealthOut, tags=["system"])
def health() -> HealthOut:
    return HealthOut(
        status="ok",
        app=settings.app_name,
        environment=settings.app_env,
        version=settings.app_version,
    )


@app.get("/ready", response_model=ReadyOut, tags=["system"])
def ready(response: Response) -> ReadyOut:
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return ReadyOut(status="ready", database="connected")
    except Exception:
        logger.exception("Readiness check failed")
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return ReadyOut(status="degraded", database="unavailable")
    finally:
        db.close()

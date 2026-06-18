from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.enums import FindingStatus, Severity
from app.core.settings import get_settings
from app.db.session import get_db
from app.schemas.entities import (
    ActivityOut,
    FindingCreate,
    FindingOut,
    ModuleOut,
    OverviewOut,
    ProjectCreate,
    ProjectOut,
    RunCreate,
    RunOut,
    SettingsStatusOut,
)
from app.services import activity, catalog, findings, runs
from app.services.overview import build_overview

router = APIRouter(prefix="/api")


@router.get("/overview", response_model=OverviewOut, tags=["overview"])
def overview(db: Session = Depends(get_db)):
    return build_overview(db)


@router.get("/projects", response_model=list[ProjectOut], tags=["projects"])
def list_projects(db: Session = Depends(get_db)):
    return catalog.list_projects(db)


@router.post("/projects", response_model=ProjectOut, status_code=201, tags=["projects"])
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    return catalog.create_project(db, payload)


@router.get("/modules", response_model=list[ModuleOut], tags=["modules"])
def list_modules(db: Session = Depends(get_db)):
    return catalog.list_modules(db)


@router.get("/runs", response_model=list[RunOut], tags=["runs"])
def list_runs(limit: int = Query(default=50, ge=1, le=200), db: Session = Depends(get_db)):
    return runs.list_runs(db, limit=limit)


@router.post("/runs", response_model=RunOut, status_code=201, tags=["runs"])
def create_run(payload: RunCreate, db: Session = Depends(get_db)):
    return runs.create_run(db, payload)


@router.get("/findings", response_model=list[FindingOut], tags=["findings"])
def list_findings(
    severity: Severity | None = None,
    status: FindingStatus | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return findings.list_findings(db, severity=severity, status_filter=status, limit=limit)


@router.post("/findings", response_model=FindingOut, status_code=201, tags=["findings"])
def create_finding(payload: FindingCreate, db: Session = Depends(get_db)):
    return findings.create_finding(db, payload)


@router.get("/activity", response_model=list[ActivityOut], tags=["activity"])
def list_activity(limit: int = Query(default=25, ge=1, le=100), db: Session = Depends(get_db)):
    return activity.list_activity(db, limit=limit)


@router.get("/settings/status", response_model=SettingsStatusOut, tags=["settings"])
def settings_status():
    settings = get_settings()
    return SettingsStatusOut(
        app_name=settings.app_name,
        environment=settings.app_env,
        version=settings.app_version,
        database="postgresql" if not settings.is_sqlite else "sqlite",
        cors_origins=settings.cors_origin_list,
        seed_on_startup=settings.seed_on_startup,
    )

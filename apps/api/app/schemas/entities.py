from datetime import datetime
from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    owner: str = "platform"
    environment: str = "production"


class ProjectOut(ProjectCreate):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ModuleOut(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    status: str
    summary: str

    model_config = {"from_attributes": True}


class ScanCreate(BaseModel):
    project_id: str
    module_id: str
    target: str
    status: str = "completed"
    score: int = Field(ge=0, le=100, default=100)


class ScanOut(ScanCreate):
    id: str
    created_at: datetime
    project_name: str | None = None
    module_name: str | None = None

    model_config = {"from_attributes": True}


class FindingCreate(BaseModel):
    scan_id: str
    title: str
    severity: str
    resource: str = ""
    recommendation: str = ""


class FindingOut(FindingCreate):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


class OverviewOut(BaseModel):
    projects: int
    modules: int
    scans: int
    findings: int
    average_score: float
    severity_counts: dict[str, int]

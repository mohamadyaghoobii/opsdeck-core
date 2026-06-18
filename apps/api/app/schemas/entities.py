from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.core.enums import FindingStatus, ModuleStatus, RunStatus, Severity


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    slug: str | None = Field(default=None, max_length=120)
    description: str = ""
    owner: str = "platform"
    environment: str = "production"
    repo_url: str = ""


class ProjectOut(ORMModel):
    id: str
    name: str
    slug: str
    description: str
    owner: str
    environment: str
    repo_url: str
    created_at: datetime


class ModuleOut(ORMModel):
    id: str
    name: str
    slug: str
    category: str
    status: ModuleStatus
    summary: str
    version: str


class RunCreate(BaseModel):
    project_id: str
    module_id: str
    target: str = ""
    status: RunStatus = RunStatus.completed
    score: int = Field(ge=0, le=100, default=100)
    summary: str = ""


class RunOut(ORMModel):
    id: str
    project_id: str
    module_id: str
    target: str
    status: RunStatus
    score: int
    summary: str
    started_at: datetime
    completed_at: datetime | None
    created_at: datetime
    project_name: str | None = None
    module_name: str | None = None


class FindingCreate(BaseModel):
    run_id: str
    title: str = Field(min_length=2, max_length=240)
    description: str = ""
    severity: Severity = Severity.medium
    status: FindingStatus = FindingStatus.open
    target: str = ""
    remediation: str = ""


class FindingOut(ORMModel):
    id: str
    run_id: str
    project_id: str
    module_id: str
    title: str
    description: str
    severity: Severity
    status: FindingStatus
    target: str
    remediation: str
    created_at: datetime
    project_name: str | None = None
    module_name: str | None = None


class ActivityOut(ORMModel):
    id: str
    kind: str
    message: str
    project_id: str | None
    created_at: datetime


class SeverityBreakdown(BaseModel):
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    info: int = 0


class ModuleStatusBreakdown(BaseModel):
    ready: int = 0
    beta: int = 0
    planned: int = 0


class OverviewOut(BaseModel):
    projects: int
    modules: int
    runs: int
    findings: int
    open_findings: int
    average_score: float
    severity_breakdown: SeverityBreakdown
    module_status_breakdown: ModuleStatusBreakdown


class HealthOut(BaseModel):
    status: str
    app: str
    environment: str
    version: str


class ReadyOut(BaseModel):
    status: str
    database: str


class SettingsStatusOut(BaseModel):
    app_name: str
    environment: str
    version: str
    database: str
    cors_origins: list[str]
    seed_on_startup: bool

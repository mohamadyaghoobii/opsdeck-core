from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.enums import FindingStatus, ModuleStatus, RunStatus, Severity
from app.db.session import Base


def new_id() -> str:
    return uuid4().hex


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    owner: Mapped[str] = mapped_column(String(160), nullable=False, default="platform")
    environment: Mapped[str] = mapped_column(String(80), nullable=False, default="production")
    repo_url: Mapped[str] = mapped_column(String(320), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    runs: Mapped[list["Run"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    findings: Mapped[list["Finding"]] = relationship(back_populates="project")


class Module(Base):
    __tablename__ = "modules"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    slug: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default=ModuleStatus.planned)
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    version: Mapped[str] = mapped_column(String(40), nullable=False, default="0.1.0")

    runs: Mapped[list["Run"]] = relationship(back_populates="module")
    findings: Mapped[list["Finding"]] = relationship(back_populates="module")


class Run(Base):
    __tablename__ = "runs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), nullable=False, index=True)
    module_id: Mapped[str] = mapped_column(ForeignKey("modules.id"), nullable=False, index=True)
    target: Mapped[str] = mapped_column(String(320), nullable=False, default="")
    status: Mapped[str] = mapped_column(String(40), nullable=False, default=RunStatus.completed)
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=100)
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    started_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    project: Mapped[Project] = relationship(back_populates="runs")
    module: Mapped[Module] = relationship(back_populates="runs")
    findings: Mapped[list["Finding"]] = relationship(back_populates="run", cascade="all, delete-orphan")


class Finding(Base):
    __tablename__ = "findings"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    run_id: Mapped[str] = mapped_column(ForeignKey("runs.id"), nullable=False, index=True)
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), nullable=False, index=True)
    module_id: Mapped[str] = mapped_column(ForeignKey("modules.id"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    severity: Mapped[str] = mapped_column(String(40), nullable=False, default=Severity.medium, index=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, default=FindingStatus.open, index=True)
    target: Mapped[str] = mapped_column(String(320), nullable=False, default="")
    remediation: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    run: Mapped[Run] = relationship(back_populates="findings")
    project: Mapped[Project] = relationship(back_populates="findings")
    module: Mapped[Module] = relationship(back_populates="findings")


class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    kind: Mapped[str] = mapped_column(String(60), nullable=False)
    message: Mapped[str] = mapped_column(String(320), nullable=False)
    project_id: Mapped[str | None] = mapped_column(ForeignKey("projects.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)

    project: Mapped[Project | None] = relationship()

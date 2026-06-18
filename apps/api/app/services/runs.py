from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import RunStatus
from app.models.entities import ActivityEvent, Module, Project, Run, utcnow
from app.schemas.entities import RunCreate, RunOut


def _to_out(run: Run) -> RunOut:
    return RunOut.model_validate(run).model_copy(
        update={"project_name": run.project.name, "module_name": run.module.name}
    )


def list_runs(db: Session, limit: int = 50) -> list[RunOut]:
    runs = db.query(Run).order_by(Run.created_at.desc()).limit(limit).all()
    return [_to_out(run) for run in runs]


def create_run(db: Session, payload: RunCreate) -> RunOut:
    if db.get(Project, payload.project_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if db.get(Module, payload.module_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    run = Run(**payload.model_dump())
    if run.status in (RunStatus.completed, RunStatus.failed):
        run.completed_at = utcnow()

    db.add(run)
    db.flush()
    db.add(
        ActivityEvent(
            kind="run.recorded",
            message=f"{run.module.name} run completed with score {run.score}",
            project_id=run.project_id,
        )
    )
    db.commit()
    db.refresh(run)
    return _to_out(run)

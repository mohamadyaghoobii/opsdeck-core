from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.enums import FindingStatus, Severity
from app.models.entities import ActivityEvent, Finding, Run
from app.schemas.entities import FindingCreate, FindingOut


def _to_out(finding: Finding) -> FindingOut:
    return FindingOut.model_validate(finding).model_copy(
        update={"project_name": finding.project.name, "module_name": finding.module.name}
    )


def list_findings(
    db: Session,
    severity: Severity | None = None,
    status_filter: FindingStatus | None = None,
    limit: int = 100,
) -> list[FindingOut]:
    query = db.query(Finding)
    if severity is not None:
        query = query.filter(Finding.severity == severity)
    if status_filter is not None:
        query = query.filter(Finding.status == status_filter)
    findings = query.order_by(Finding.created_at.desc()).limit(limit).all()
    return [_to_out(finding) for finding in findings]


def create_finding(db: Session, payload: FindingCreate) -> FindingOut:
    run = db.get(Run, payload.run_id)
    if run is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Run not found")

    finding = Finding(
        **payload.model_dump(),
        project_id=run.project_id,
        module_id=run.module_id,
    )
    db.add(finding)
    db.add(
        ActivityEvent(
            kind="finding.created",
            message=f"New {finding.severity} finding: {finding.title}",
            project_id=run.project_id,
        )
    )
    db.commit()
    db.refresh(finding)
    return _to_out(finding)

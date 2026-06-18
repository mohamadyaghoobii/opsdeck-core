from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.enums import FindingStatus, ModuleStatus, Severity
from app.models.entities import Finding, Module, Project, Run


def build_overview(db: Session) -> dict:
    severity_breakdown = {severity.value: 0 for severity in Severity}
    severity_rows = db.query(Finding.severity, func.count(Finding.id)).group_by(Finding.severity).all()
    for severity, count in severity_rows:
        severity_breakdown[str(severity)] = count

    module_status_breakdown = {status.value: 0 for status in ModuleStatus}
    module_rows = db.query(Module.status, func.count(Module.id)).group_by(Module.status).all()
    for status, count in module_rows:
        module_status_breakdown[str(status)] = count

    average_score = db.query(func.avg(Run.score)).scalar() or 0
    open_findings = db.query(Finding).filter(Finding.status == FindingStatus.open).count()

    return {
        "projects": db.query(Project).count(),
        "modules": db.query(Module).count(),
        "runs": db.query(Run).count(),
        "findings": db.query(Finding).count(),
        "open_findings": open_findings,
        "average_score": round(float(average_score), 1),
        "severity_breakdown": severity_breakdown,
        "module_status_breakdown": module_status_breakdown,
    }

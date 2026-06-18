from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.entities import Finding, Module, Project, Scan


def build_overview(db: Session) -> dict:
    severities = ["critical", "high", "medium", "low", "info"]
    severity_counts = {severity: 0 for severity in severities}
    rows = db.query(Finding.severity, func.count(Finding.id)).group_by(Finding.severity).all()
    for severity, count in rows:
        severity_counts[str(severity).lower()] = count

    average_score = db.query(func.avg(Scan.score)).scalar() or 0

    return {
        "projects": db.query(Project).count(),
        "modules": db.query(Module).count(),
        "scans": db.query(Scan).count(),
        "findings": db.query(Finding).count(),
        "average_score": round(float(average_score), 1),
        "severity_counts": severity_counts,
    }

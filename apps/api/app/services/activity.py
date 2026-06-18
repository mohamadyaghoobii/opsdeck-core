from sqlalchemy.orm import Session

from app.models.entities import ActivityEvent


def list_activity(db: Session, limit: int = 25) -> list[ActivityEvent]:
    return db.query(ActivityEvent).order_by(ActivityEvent.created_at.desc()).limit(limit).all()

from sqlalchemy.orm import Session

from app.models.entities import ActivityEvent, Module, Project
from app.schemas.entities import ProjectCreate
from app.services.text import slugify


def list_projects(db: Session) -> list[Project]:
    return db.query(Project).order_by(Project.created_at.desc()).all()


def create_project(db: Session, payload: ProjectCreate) -> Project:
    data = payload.model_dump()
    data["slug"] = data.get("slug") or slugify(payload.name)
    project = Project(**data)
    db.add(project)
    db.add(ActivityEvent(kind="project.created", message=f"Project {project.name} was created", project_id=project.id))
    db.commit()
    db.refresh(project)
    return project


def list_modules(db: Session) -> list[Module]:
    return db.query(Module).order_by(Module.category.asc(), Module.name.asc()).all()

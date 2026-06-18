from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Finding, Module, Project, Scan
from app.schemas.entities import FindingCreate, FindingOut, ModuleOut, OverviewOut, ProjectCreate, ProjectOut, ScanCreate, ScanOut
from app.services.overview import build_overview

router = APIRouter(prefix="/api")


@router.get("/overview", response_model=OverviewOut)
def overview(db: Session = Depends(get_db)):
    return build_overview(db)


@router.get("/projects", response_model=list[ProjectOut])
def projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.created_at.desc()).all()


@router.post("/projects", response_model=ProjectOut)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/modules", response_model=list[ModuleOut])
def modules(db: Session = Depends(get_db)):
    return db.query(Module).order_by(Module.category.asc(), Module.name.asc()).all()


@router.get("/scans", response_model=list[ScanOut])
def scans(db: Session = Depends(get_db)):
    rows = db.query(Scan).order_by(Scan.created_at.desc()).limit(50).all()
    return [ScanOut.model_validate(row).model_copy(update={"project_name": row.project.name, "module_name": row.module.name}) for row in rows]


@router.post("/scans", response_model=ScanOut)
def create_scan(payload: ScanCreate, db: Session = Depends(get_db)):
    scan = Scan(**payload.model_dump())
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return ScanOut.model_validate(scan).model_copy(update={"project_name": scan.project.name, "module_name": scan.module.name})


@router.get("/findings", response_model=list[FindingOut])
def findings(db: Session = Depends(get_db)):
    return db.query(Finding).order_by(Finding.created_at.desc()).limit(100).all()


@router.post("/findings", response_model=FindingOut)
def create_finding(payload: FindingCreate, db: Session = Depends(get_db)):
    finding = Finding(**payload.model_dump())
    db.add(finding)
    db.commit()
    db.refresh(finding)
    return finding

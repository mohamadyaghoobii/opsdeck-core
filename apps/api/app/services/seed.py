from sqlalchemy.orm import Session
from app.models.entities import Finding, Module, Project, Scan


def seed_database(db: Session) -> None:
    if db.query(Module).count() > 0:
        return

    modules = [
        Module(name="Kubernetes Review", slug="kubernetes-review", category="cluster", status="planned", summary="Manifest, RBAC, workload, and ingress review."),
        Module(name="Container Build Review", slug="container-build-review", category="containers", status="planned", summary="Dockerfile and image build hygiene checks."),
        Module(name="Pipeline Review", slug="pipeline-review", category="delivery", status="planned", summary="CI/CD workflow safety and supply-chain checks."),
        Module(name="Infrastructure Review", slug="infrastructure-review", category="iac", status="planned", summary="Terraform and cloud resource posture checks."),
        Module(name="Observability Review", slug="observability-review", category="sre", status="planned", summary="Logging, metrics, SLO, alert, and runbook readiness."),
        Module(name="Report Center", slug="report-center", category="exports", status="ready", summary="Executive and technical report generation."),
    ]
    db.add_all(modules)
    db.flush()

    project = Project(name="Checkout Platform", owner="platform-team", environment="production")
    db.add(project)
    db.flush()

    scan = Scan(project_id=project.id, module_id=modules[0].id, target="checkout namespace", status="completed", score=72)
    db.add(scan)
    db.flush()

    findings = [
        Finding(scan_id=scan.id, title="Container can run as root", severity="high", resource="deployment/api", recommendation="Set runAsNonRoot and a fixed non-root UID."),
        Finding(scan_id=scan.id, title="Missing CPU and memory limits", severity="medium", resource="deployment/worker", recommendation="Add resource requests and limits based on observed usage."),
        Finding(scan_id=scan.id, title="Ingress has no explicit TLS policy", severity="medium", resource="ingress/public", recommendation="Require TLS and document certificate ownership."),
    ]
    db.add_all(findings)
    db.commit()

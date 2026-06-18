from datetime import timedelta

from sqlalchemy.orm import Session

from app.core.enums import FindingStatus, ModuleStatus, RunStatus, Severity
from app.models.entities import ActivityEvent, Finding, Module, Project, Run, utcnow

MODULES = [
    {
        "name": "Kubernetes Review",
        "slug": "kubernetes-review",
        "category": "Cluster",
        "status": ModuleStatus.planned,
        "summary": "Workload, RBAC, network policy, and ingress review for Kubernetes manifests.",
    },
    {
        "name": "Container Build Review",
        "slug": "container-build-review",
        "category": "Containers",
        "status": ModuleStatus.planned,
        "summary": "Dockerfile and image build hygiene, base image, and layer checks.",
    },
    {
        "name": "Pipeline Review",
        "slug": "pipeline-review",
        "category": "Delivery",
        "status": ModuleStatus.planned,
        "summary": "CI/CD workflow permissions, secret handling, and supply-chain checks.",
    },
    {
        "name": "Infrastructure Review",
        "slug": "infrastructure-review",
        "category": "IaC",
        "status": ModuleStatus.planned,
        "summary": "Terraform and cloud resource posture, drift, and policy checks.",
    },
    {
        "name": "Observability Review",
        "slug": "observability-review",
        "category": "SRE",
        "status": ModuleStatus.beta,
        "summary": "Logging, metrics, SLO coverage, alert quality, and runbook readiness.",
    },
    {
        "name": "Report Center",
        "slug": "report-center",
        "category": "Reporting",
        "status": ModuleStatus.ready,
        "summary": "Executive and technical report generation across connected modules.",
    },
]

PROJECTS = [
    {
        "name": "Checkout Platform",
        "slug": "checkout-platform",
        "description": "Customer-facing payments and checkout services.",
        "owner": "payments-team",
        "environment": "production",
        "repo_url": "https://github.com/example/checkout-platform",
    },
    {
        "name": "Internal Tooling",
        "slug": "internal-tooling",
        "description": "Shared developer tooling and internal services.",
        "owner": "platform-team",
        "environment": "staging",
        "repo_url": "https://github.com/example/internal-tooling",
    },
]


def seed_database(db: Session) -> None:
    if db.query(Module).count() > 0:
        return

    modules = [Module(**data) for data in MODULES]
    db.add_all(modules)

    projects = [Project(**data) for data in PROJECTS]
    db.add_all(projects)
    db.flush()

    module_by_slug = {module.slug: module for module in modules}
    checkout, internal = projects
    now = utcnow()

    runs = [
        Run(
            project_id=checkout.id,
            module_id=module_by_slug["kubernetes-review"].id,
            target="checkout namespace",
            status=RunStatus.completed,
            score=72,
            summary="3 findings across workload and ingress configuration.",
            started_at=now - timedelta(hours=6),
            completed_at=now - timedelta(hours=6) + timedelta(minutes=2),
            created_at=now - timedelta(hours=6),
        ),
        Run(
            project_id=checkout.id,
            module_id=module_by_slug["observability-review"].id,
            target="checkout services",
            status=RunStatus.completed,
            score=88,
            summary="Alert coverage healthy, one SLO gap.",
            started_at=now - timedelta(hours=3),
            completed_at=now - timedelta(hours=3) + timedelta(minutes=1),
            created_at=now - timedelta(hours=3),
        ),
        Run(
            project_id=internal.id,
            module_id=module_by_slug["container-build-review"].id,
            target="tooling/Dockerfile",
            status=RunStatus.completed,
            score=64,
            summary="Base image is outdated and runs as root.",
            started_at=now - timedelta(hours=1),
            completed_at=now - timedelta(hours=1) + timedelta(minutes=1),
            created_at=now - timedelta(hours=1),
        ),
    ]
    db.add_all(runs)
    db.flush()

    k8s_run, obs_run, build_run = runs
    findings = [
        Finding(
            run_id=k8s_run.id,
            project_id=k8s_run.project_id,
            module_id=k8s_run.module_id,
            title="Container can run as root",
            description="The api deployment does not enforce a non-root security context.",
            severity=Severity.high,
            status=FindingStatus.open,
            target="deployment/api",
            remediation="Set runAsNonRoot: true and a fixed non-root UID in the pod security context.",
        ),
        Finding(
            run_id=k8s_run.id,
            project_id=k8s_run.project_id,
            module_id=k8s_run.module_id,
            title="Missing CPU and memory limits",
            description="The worker deployment has no resource requests or limits.",
            severity=Severity.medium,
            status=FindingStatus.in_progress,
            target="deployment/worker",
            remediation="Add resource requests and limits based on observed usage.",
        ),
        Finding(
            run_id=k8s_run.id,
            project_id=k8s_run.project_id,
            module_id=k8s_run.module_id,
            title="Ingress has no explicit TLS policy",
            description="The public ingress does not require TLS termination.",
            severity=Severity.medium,
            status=FindingStatus.open,
            target="ingress/public",
            remediation="Require TLS and document certificate ownership.",
        ),
        Finding(
            run_id=obs_run.id,
            project_id=obs_run.project_id,
            module_id=obs_run.module_id,
            title="Checkout latency SLO is undefined",
            description="No latency SLO is defined for the checkout request path.",
            severity=Severity.low,
            status=FindingStatus.open,
            target="service/checkout-api",
            remediation="Define a latency SLO and wire it to an alerting policy.",
        ),
        Finding(
            run_id=build_run.id,
            project_id=build_run.project_id,
            module_id=build_run.module_id,
            title="Base image is outdated",
            description="The build uses an image tag that is several versions behind.",
            severity=Severity.high,
            status=FindingStatus.open,
            target="tooling/Dockerfile",
            remediation="Pin and update to a current, supported base image.",
        ),
    ]
    db.add_all(findings)

    events = [
        ActivityEvent(kind="run.recorded", message="Kubernetes Review run completed with score 72", project_id=checkout.id, created_at=now - timedelta(hours=6)),
        ActivityEvent(kind="finding.created", message="New high finding: Container can run as root", project_id=checkout.id, created_at=now - timedelta(hours=6)),
        ActivityEvent(kind="run.recorded", message="Observability Review run completed with score 88", project_id=checkout.id, created_at=now - timedelta(hours=3)),
        ActivityEvent(kind="run.recorded", message="Container Build Review run completed with score 64", project_id=internal.id, created_at=now - timedelta(hours=1)),
    ]
    db.add_all(events)
    db.commit()

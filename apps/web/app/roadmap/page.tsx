import { PageHeader } from "@/components/PageHeader";
import { Badge, Card, CardHeader } from "@/components/ui";

type Phase = {
  phase: string;
  title: string;
  description: string;
  state: "shipped" | "in_progress" | "planned";
};

const PHASES: Phase[] = [
  {
    phase: "Phase 0",
    title: "Control plane core",
    description: "Projects, modules, runs, findings, activity, and the dashboard. This repository.",
    state: "shipped",
  },
  {
    phase: "Phase 1",
    title: "Kubernetes workload analyzer",
    description: "Workload, RBAC, network policy, and ingress review for cluster manifests.",
    state: "planned",
  },
  {
    phase: "Phase 2",
    title: "Container build analyzer",
    description: "Dockerfile and image build hygiene, base image freshness, and layer checks.",
    state: "planned",
  },
  {
    phase: "Phase 3",
    title: "CI/CD pipeline auditor",
    description: "Workflow permissions, secret handling, and supply-chain integrity checks.",
    state: "planned",
  },
  {
    phase: "Phase 4",
    title: "Terraform / IaC auditor",
    description: "Cloud resource posture, drift detection, and policy enforcement.",
    state: "planned",
  },
  {
    phase: "Phase 5",
    title: "Secrets & SBOM module",
    description: "Secret detection and software bill of materials across services.",
    state: "planned",
  },
  {
    phase: "Phase 6",
    title: "Observability & runbooks",
    description: "SLO coverage, alert quality scoring, and runbook generation.",
    state: "planned",
  },
  {
    phase: "Phase 7",
    title: "Report generator",
    description: "Executive and technical reports aggregated across connected modules.",
    state: "planned",
  },
];

const stateBadge: Record<Phase["state"], { tone: "ok" | "accent" | "neutral"; label: string }> = {
  shipped: { tone: "ok", label: "Shipped" },
  in_progress: { tone: "accent", label: "In progress" },
  planned: { tone: "neutral", label: "Planned" },
};

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        title="Roadmap"
        subtitle="How OpsDeck grows from a core control plane into a full DevSecOps platform."
      />
      <div className="page-body">
        <Card>
          <CardHeader title="Delivery phases" meta={`${PHASES.length} phases`} />
          <div className="timeline">
            {PHASES.map((phase) => {
              const badge = stateBadge[phase.state];
              return (
                <div className="timeline-item" key={phase.phase}>
                  <div className="timeline-phase">{phase.phase}</div>
                  <div>
                    <div className="row-between">
                      <div className="timeline-title">{phase.title}</div>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </div>
                    <div className="timeline-desc">{phase.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

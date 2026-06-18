import { PageHeader } from "@/components/PageHeader";
import { Card, EmptyState, ErrorState, ModuleStatusBadge } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { getModules, type Module } from "@/lib/api";

const categoryIcon: Record<string, IconName> = {
  Cluster: "cluster",
  Containers: "container",
  Delivery: "pipeline",
  IaC: "iac",
  SRE: "sre",
  Reporting: "report",
};

function ModuleCard({ module }: { module: Module }) {
  return (
    <Card className="module-card">
      <div className="top">
        <span className="module-icon">
          <Icon name={categoryIcon[module.category] ?? "modules"} />
        </span>
        <ModuleStatusBadge status={module.status} />
      </div>
      <div>
        <div className="name">{module.name}</div>
        <div className="cat">{module.category}</div>
      </div>
      <p className="summary">{module.summary}</p>
      <div className="foot">
        <span className="mono faint">{module.slug}</span>
        <span className="faint">v{module.version}</span>
      </div>
    </Card>
  );
}

export default async function ModulesPage() {
  const result = await getModules();

  return (
    <>
      <PageHeader
        title="Modules"
        subtitle="Analyzer modules registered in the control plane. Future modules connect here."
      />
      <div className="page-body">
        {!result.ok ? (
          <ErrorState message={result.error} />
        ) : result.data.length === 0 ? (
          <Card>
            <EmptyState title="No modules" message="No analyzer modules are registered yet." />
          </Card>
        ) : (
          <section className="grid cols-3">
            {result.data.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

import { PageHeader } from "@/components/PageHeader";
import { SeverityBar } from "@/components/SeverityBar";
import { Icon } from "@/components/icons";
import {
  Card,
  CardHeader,
  EmptyState,
  ErrorState,
  ModuleStatusBadge,
  ScoreValue,
  SeverityBadge,
  StatCard,
} from "@/components/ui";
import { getActivity, getFindings, getModules, getOverview, getRuns, unwrap } from "@/lib/api";
import { relativeTime } from "@/lib/format";

export default async function OverviewPage() {
  const [overviewResult, modulesResult, runsResult, findingsResult, activityResult] = await Promise.all([
    getOverview(),
    getModules(),
    getRuns(),
    getFindings(),
    getActivity(),
  ]);

  if (!overviewResult.ok) {
    return (
      <>
        <PageHeader title="Overview" subtitle="Platform posture across projects, modules, and findings." />
        <div className="page-body">
          <ErrorState message={overviewResult.error} />
        </div>
      </>
    );
  }

  const overview = overviewResult.data;
  const modules = unwrap(modulesResult, []);
  const runs = unwrap(runsResult, []).slice(0, 5);
  const findings = unwrap(findingsResult, []).slice(0, 5);
  const activity = unwrap(activityResult, []).slice(0, 6);

  return (
    <>
      <PageHeader title="Overview" subtitle="Platform posture across projects, modules, and findings." />
      <div className="page-body">
        <section className="grid cols-4">
          <StatCard icon="projects" label="Projects" value={overview.projects} hint="tracked in inventory" />
          <StatCard icon="modules" label="Modules" value={overview.modules} hint="registered in control plane" />
          <StatCard icon="runs" label="Runs" value={overview.runs} hint="recorded across modules" />
          <StatCard
            icon="findings"
            label="Open findings"
            value={overview.open_findings}
            hint={`${overview.findings} total · avg score ${overview.average_score}`}
          />
        </section>

        <section className="grid cols-2">
          <Card>
            <CardHeader title="Severity distribution" meta={`${overview.findings} findings`} />
            <div className="card-pad">
              <SeverityBar breakdown={overview.severity_breakdown} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Module readiness" meta={`${modules.length} modules`} />
            <div className="rows">
              {modules.length === 0 ? (
                <EmptyState title="No modules" message="No modules are registered yet." />
              ) : (
                modules.map((module) => (
                  <div className="list-row" key={module.id}>
                    <div>
                      <div className="primary">{module.name}</div>
                      <div className="secondary">{module.category}</div>
                    </div>
                    <ModuleStatusBadge status={module.status} />
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section className="grid cols-2">
          <Card>
            <CardHeader title="Recent runs" meta={`${runs.length} shown`} />
            <div className="rows">
              {runs.length === 0 ? (
                <EmptyState title="No runs yet" message="Module runs will appear here once recorded." />
              ) : (
                runs.map((run) => (
                  <div className="list-row" key={run.id}>
                    <div>
                      <div className="primary">{run.module_name}</div>
                      <div className="secondary">
                        {run.project_name} · <code>{run.target || "—"}</code>
                      </div>
                    </div>
                    <ScoreValue score={run.score} />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent findings" meta={`${overview.open_findings} open`} />
            <div className="rows">
              {findings.length === 0 ? (
                <EmptyState title="No findings" message="Findings from module runs will show up here." />
              ) : (
                findings.map((finding) => (
                  <div className="list-row" key={finding.id}>
                    <div>
                      <div className="primary">{finding.title}</div>
                      <div className="secondary">
                        {finding.module_name} · <code>{finding.target || "—"}</code>
                      </div>
                    </div>
                    <SeverityBadge severity={finding.severity} />
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader title="Recent activity" meta="Latest platform events" />
            <div className="activity">
              {activity.length === 0 ? (
                <EmptyState title="No activity" message="Platform events will be recorded here." />
              ) : (
                activity.map((event) => (
                  <div className="activity-item" key={event.id}>
                    <span className="activity-icon">
                      <Icon name={event.kind.startsWith("finding") ? "findings" : "runs"} />
                    </span>
                    <div>
                      <div className="activity-msg">{event.message}</div>
                      <div className="activity-time">{relativeTime(event.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}

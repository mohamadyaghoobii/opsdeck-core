import { MetricCard, Pill } from "@/components/Cards";
import { Shell } from "@/components/Shell";
import { getFindings, getModules, getOverview, getProjects, getScans } from "@/lib/api";

function toneForSeverity(severity: string) {
  if (["critical", "high"].includes(severity.toLowerCase())) return "bad" as const;
  if (severity.toLowerCase() === "medium") return "warn" as const;
  return "neutral" as const;
}

export default async function Home() {
  const [overview, projects, modules, scans, findings] = await Promise.all([
    getOverview(), getProjects(), getModules(), getScans(), getFindings()
  ]);

  return (
    <Shell>
      <div className="hero">
        <div>
          <p className="eyebrow">Control room</p>
          <h1>OpsDeck</h1>
          <p>Track projects, scan history, module health, and remediation progress from one platform dashboard.</p>
        </div>
        <div className="apiState">API connected</div>
      </div>

      <section className="grid four">
        <MetricCard label="Projects" value={overview.projects} hint="active workspaces" />
        <MetricCard label="Modules" value={overview.modules} hint="registered analyzers" />
        <MetricCard label="Scans" value={overview.scans} hint="recorded runs" />
        <MetricCard label="Average Score" value={overview.average_score} hint="latest posture" />
      </section>

      <section className="grid two">
        <div className="card">
          <div className="sectionHead"><h2>Module roadmap</h2><span>{modules.length} modules</span></div>
          <div className="list">
            {modules.map((item) => (
              <div className="row" key={item.id}>
                <div><strong>{item.name}</strong><small>{item.summary}</small></div>
                <Pill tone={item.status === "ready" ? "good" : "neutral"}>{item.status}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="sectionHead"><h2>Recent findings</h2><span>{overview.findings} total</span></div>
          <div className="list">
            {findings.map((item) => (
              <div className="row" key={item.id}>
                <div><strong>{item.title}</strong><small>{item.resource}</small></div>
                <Pill tone={toneForSeverity(item.severity)}>{item.severity}</Pill>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two">
        <div className="card">
          <div className="sectionHead"><h2>Projects</h2><span>{projects.length} tracked</span></div>
          <div className="list">
            {projects.map((item) => (
              <div className="row" key={item.id}>
                <div><strong>{item.name}</strong><small>{item.owner}</small></div>
                <Pill>{item.environment}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="sectionHead"><h2>Latest scans</h2><span>{scans.length} shown</span></div>
          <div className="list">
            {scans.map((item) => (
              <div className="row" key={item.id}>
                <div><strong>{item.target}</strong><small>{item.module_name} · {item.project_name}</small></div>
                <Pill tone={item.score >= 80 ? "good" : item.score >= 60 ? "warn" : "bad"}>{item.score}</Pill>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}

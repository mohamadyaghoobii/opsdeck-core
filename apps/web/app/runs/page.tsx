import { PageHeader } from "@/components/PageHeader";
import { Badge, Card, EmptyState, ErrorState, ScoreValue } from "@/components/ui";
import { getRuns, type Run } from "@/lib/api";
import { label, relativeTime } from "@/lib/format";

const statusTone: Record<Run["status"], "ok" | "warn" | "bad" | "neutral" | "accent"> = {
  completed: "ok",
  running: "accent",
  queued: "neutral",
  failed: "bad",
};

export default async function RunsPage() {
  const result = await getRuns();

  return (
    <>
      <PageHeader title="Runs" subtitle="History of module runs recorded against projects." />
      <div className="page-body">
        {!result.ok ? (
          <ErrorState message={result.error} />
        ) : result.data.length === 0 ? (
          <Card>
            <EmptyState title="No runs yet" message="Recorded module runs will appear here." />
          </Card>
        ) : (
          <Card>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Project</th>
                    <th>Target</th>
                    <th>Status</th>
                    <th>Score</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((run) => (
                    <tr key={run.id}>
                      <td>
                        <div className="cell-title">{run.module_name}</div>
                        {run.summary ? <div className="cell-sub">{run.summary}</div> : null}
                      </td>
                      <td>{run.project_name}</td>
                      <td className="mono muted">{run.target || "—"}</td>
                      <td>
                        <Badge tone={statusTone[run.status] ?? "neutral"}>{label(run.status)}</Badge>
                      </td>
                      <td>
                        <ScoreValue score={run.score} />
                      </td>
                      <td className="muted">{relativeTime(run.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

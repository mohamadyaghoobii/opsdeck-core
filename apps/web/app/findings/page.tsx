import { PageHeader } from "@/components/PageHeader";
import { SeverityBar } from "@/components/SeverityBar";
import { Card, CardHeader, EmptyState, ErrorState, FindingStatusBadge, SeverityBadge } from "@/components/ui";
import { getFindings, type SeverityBreakdown } from "@/lib/api";
import { relativeTime } from "@/lib/format";

function breakdownFrom(findings: { severity: keyof SeverityBreakdown }[]): SeverityBreakdown {
  const base: SeverityBreakdown = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const finding of findings) base[finding.severity] += 1;
  return base;
}

export default async function FindingsPage() {
  const result = await getFindings();

  return (
    <>
      <PageHeader title="Findings" subtitle="Issues raised by module runs, with severity and remediation." />
      <div className="page-body">
        {!result.ok ? (
          <ErrorState message={result.error} />
        ) : result.data.length === 0 ? (
          <Card>
            <EmptyState title="No findings" message="When module runs produce findings, they will appear here." />
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader title="Severity distribution" meta={`${result.data.length} findings`} />
              <div className="card-pad">
                <SeverityBar breakdown={breakdownFrom(result.data)} />
              </div>
            </Card>

            <Card>
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Finding</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th>Module</th>
                      <th>Target</th>
                      <th>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((finding) => (
                      <tr key={finding.id}>
                        <td>
                          <div className="cell-title">{finding.title}</div>
                          {finding.remediation ? <div className="cell-sub">{finding.remediation}</div> : null}
                        </td>
                        <td>
                          <SeverityBadge severity={finding.severity} />
                        </td>
                        <td>
                          <FindingStatusBadge status={finding.status} />
                        </td>
                        <td className="muted">{finding.module_name}</td>
                        <td className="mono muted">{finding.target || "—"}</td>
                        <td className="muted">{relativeTime(finding.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

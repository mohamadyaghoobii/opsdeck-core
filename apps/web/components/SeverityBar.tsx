import type { SeverityBreakdown, Severity } from "@/lib/api";

const ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];

const COLORS: Record<Severity, string> = {
  critical: "var(--sev-critical)",
  high: "var(--sev-high)",
  medium: "var(--sev-medium)",
  low: "var(--sev-low)",
  info: "var(--sev-info)",
};

export function SeverityBar({ breakdown }: { breakdown: SeverityBreakdown }) {
  const total = ORDER.reduce((sum, sev) => sum + (breakdown[sev] || 0), 0);

  return (
    <div>
      <div className="sev-bar">
        {total === 0 ? (
          <div className="sev-seg info" style={{ width: "100%", opacity: 0.4 }} />
        ) : (
          ORDER.map((sev) => {
            const count = breakdown[sev] || 0;
            if (count === 0) return null;
            return (
              <div
                key={sev}
                className={`sev-seg ${sev}`}
                style={{ width: `${(count / total) * 100}%` }}
                title={`${sev}: ${count}`}
              />
            );
          })
        )}
      </div>
      <div className="sev-legend">
        {ORDER.map((sev) => (
          <div className="sev-legend-item" key={sev}>
            <span className="swatch" style={{ background: COLORS[sev] }} />
            <span style={{ textTransform: "capitalize" }}>{sev}</span>
            <strong>{breakdown[sev] || 0}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

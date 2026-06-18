export function MetricCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="card metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{hint}</p>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

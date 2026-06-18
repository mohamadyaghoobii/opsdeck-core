import type { ReactNode } from "react";

import type { Finding, Module, Severity } from "@/lib/api";
import { label } from "@/lib/format";
import { Icon, type IconName } from "@/components/icons";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="card-header">
      <h2>{title}</h2>
      {meta ? <span className="meta">{meta}</span> : null}
    </div>
  );
}

export function StatCard({
  icon,
  label: statLabel,
  value,
  hint,
}: {
  icon: IconName;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card className="stat">
      <div className="stat-label">
        <Icon name={icon} />
        {statLabel}
      </div>
      <div className="stat-value">{value}</div>
      {hint ? <div className="stat-hint">{hint}</div> : null}
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "bad" | "accent";
}) {
  const cls = tone === "neutral" ? "badge" : `badge ${tone}`;
  return <span className={cls}>{children}</span>;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={`badge sev-${severity}`}>
      <span className="dot" />
      {label(severity)}
    </span>
  );
}

const findingStatusTone: Record<Finding["status"], "neutral" | "ok" | "warn" | "bad"> = {
  open: "bad",
  in_progress: "warn",
  resolved: "ok",
  suppressed: "neutral",
};

export function FindingStatusBadge({ status }: { status: Finding["status"] }) {
  return <Badge tone={findingStatusTone[status]}>{label(status)}</Badge>;
}

const moduleStatusTone: Record<Module["status"], "ok" | "accent" | "neutral"> = {
  ready: "ok",
  beta: "accent",
  planned: "neutral",
};

export function ModuleStatusBadge({ status }: { status: Module["status"] }) {
  return <Badge tone={moduleStatusTone[status]}>{label(status)}</Badge>;
}

export function ScoreValue({ score }: { score: number }) {
  const cls = score >= 80 ? "good" : score >= 60 ? "mid" : "bad";
  return <span className={`score ${cls}`}>{score}</span>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="state">
      <Icon name="findings" />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="banner">
      <Icon name="alert" />
      <span>{message}. Make sure the API is running and reachable.</span>
    </div>
  );
}

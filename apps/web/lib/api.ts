export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type FindingStatus = "open" | "in_progress" | "resolved" | "suppressed";
export type RunStatus = "queued" | "running" | "completed" | "failed";
export type ModuleStatus = "ready" | "beta" | "planned";

export type SeverityBreakdown = Record<Severity, number>;
export type ModuleStatusBreakdown = Record<ModuleStatus, number>;

export type Overview = {
  projects: number;
  modules: number;
  runs: number;
  findings: number;
  open_findings: number;
  average_score: number;
  severity_breakdown: SeverityBreakdown;
  module_status_breakdown: ModuleStatusBreakdown;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: string;
  environment: string;
  repo_url: string;
  created_at: string;
};

export type Module = {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: ModuleStatus;
  summary: string;
  version: string;
};

export type Run = {
  id: string;
  project_id: string;
  module_id: string;
  target: string;
  status: RunStatus;
  score: number;
  summary: string;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  project_name?: string;
  module_name?: string;
};

export type Finding = {
  id: string;
  run_id: string;
  project_id: string;
  module_id: string;
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  target: string;
  remediation: string;
  created_at: string;
  project_name?: string;
  module_name?: string;
};

export type Activity = {
  id: string;
  kind: string;
  message: string;
  project_id: string | null;
  created_at: string;
};

export type SettingsStatus = {
  app_name: string;
  environment: string;
  version: string;
  database: string;
  cors_origins: string[];
  seed_on_startup: boolean;
};

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function get<T>(path: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) {
      return { ok: false, error: `API responded with ${res.status}` };
    }
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, error: "Unable to reach the OpsDeck API" };
  }
}

export const getOverview = () => get<Overview>("/api/overview");
export const getProjects = () => get<Project[]>("/api/projects");
export const getModules = () => get<Module[]>("/api/modules");
export const getRuns = () => get<Run[]>("/api/runs");
export const getFindings = () => get<Finding[]>("/api/findings");
export const getActivity = () => get<Activity[]>("/api/activity");
export const getSettingsStatus = () => get<SettingsStatus>("/api/settings/status");

export function unwrap<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export type Overview = {
  projects: number;
  modules: number;
  scans: number;
  findings: number;
  average_score: number;
  severity_counts: Record<string, number>;
};

export type Project = {
  id: string;
  name: string;
  owner: string;
  environment: string;
  created_at: string;
};

export type Module = {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
  summary: string;
};

export type Scan = {
  id: string;
  project_id: string;
  module_id: string;
  target: string;
  status: string;
  score: number;
  created_at: string;
  project_name?: string;
  module_name?: string;
};

export type Finding = {
  id: string;
  scan_id: string;
  title: string;
  severity: string;
  resource: string;
  recommendation: string;
  created_at: string;
};

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export async function getOverview() {
  return getJson<Overview>("/api/overview", {
    projects: 0,
    modules: 0,
    scans: 0,
    findings: 0,
    average_score: 0,
    severity_counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
  });
}

export async function getProjects() {
  return getJson<Project[]>("/api/projects", []);
}

export async function getModules() {
  return getJson<Module[]>("/api/modules", []);
}

export async function getScans() {
  return getJson<Scan[]>("/api/scans", []);
}

export async function getFindings() {
  return getJson<Finding[]>("/api/findings", []);
}

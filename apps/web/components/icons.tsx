type IconProps = { name: IconName };

export type IconName =
  | "overview"
  | "projects"
  | "modules"
  | "runs"
  | "findings"
  | "activity"
  | "roadmap"
  | "status"
  | "shield"
  | "alert"
  | "check"
  | "cluster"
  | "container"
  | "pipeline"
  | "iac"
  | "sre"
  | "report"
  | "plug"
  | "offline";

const paths: Record<IconName, JSX.Element> = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  projects: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  modules: (
    <>
      <path d="M12 2 3 7l9 5 9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </>
  ),
  runs: (
    <>
      <path d="M5 3v18" />
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <path d="M19 6h-7a4 4 0 0 0-4 4v8" />
      <circle cx="19" cy="6" r="2.2" />
    </>
  ),
  findings: (
    <>
      <path d="M12 2 3 6v6c0 5 3.8 8.5 9 10 5.2-1.5 9-5 9-10V6z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  activity: (
    <>
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </>
  ),
  roadmap: (
    <>
      <path d="M4 19V6a2 2 0 0 1 2-2h8" />
      <path d="M14 4l4 3-4 3" />
      <circle cx="6" cy="19" r="1.6" />
      <path d="M8 19h8" />
    </>
  ),
  status: (
    <>
      <path d="M22 12h-4l-3 9-6-18-3 9H2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6z" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5L16 9.5" />
    </>
  ),
  cluster: (
    <>
      <circle cx="12" cy="5" r="2.4" />
      <circle cx="5" cy="18" r="2.4" />
      <circle cx="19" cy="18" r="2.4" />
      <path d="M12 7.4v3.6M12 11l-5.5 4.4M12 11l5.5 4.4" />
    </>
  ),
  container: (
    <>
      <path d="M3 8 12 3l9 5v8l-9 5-9-5z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  pipeline: (
    <>
      <rect x="3" y="4" width="6" height="5" rx="1.2" />
      <rect x="15" y="15" width="6" height="5" rx="1.2" />
      <path d="M9 6.5h5a3 3 0 0 1 3 3V15" />
    </>
  ),
  iac: (
    <>
      <path d="M9 6 4 12l5 6M15 6l5 6-5 6" />
    </>
  ),
  sre: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  report: (
    <>
      <path d="M6 3h9l3 3v15a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0z" />
      <path d="M9 12h6M9 16h6M9 8h2" />
    </>
  ),
  plug: (
    <>
      <path d="M9 2v6M15 2v6" />
      <path d="M7 8h10v3a5 5 0 0 1-10 0z" />
      <path d="M12 16v6" />
    </>
  ),
  offline: (
    <>
      <path d="M12 3 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6z" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
};

export function Icon({ name }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

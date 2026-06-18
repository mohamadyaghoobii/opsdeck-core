import type { ReactNode } from "react";

import { ApiStatus } from "@/components/ApiStatus";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <div>{actions ?? <ApiStatus />}</div>
    </header>
  );
}

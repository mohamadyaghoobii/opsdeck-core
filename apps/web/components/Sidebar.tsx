"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon, type IconName } from "@/components/icons";

type NavLink = { href: string; label: string; icon: IconName };

const PLATFORM: NavLink[] = [
  { href: "/", label: "Overview", icon: "overview" },
  { href: "/projects", label: "Projects", icon: "projects" },
  { href: "/modules", label: "Modules", icon: "modules" },
];

const OPERATIONS: NavLink[] = [
  { href: "/runs", label: "Runs", icon: "runs" },
  { href: "/findings", label: "Findings", icon: "findings" },
];

const PLATFORM_SECONDARY: NavLink[] = [
  { href: "/roadmap", label: "Roadmap", icon: "roadmap" },
  { href: "/status", label: "System status", icon: "status" },
];

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link href={link.href} className={`nav-item ${active ? "active" : ""}`}>
      <Icon name={link.icon} />
      {link.label}
    </Link>
  );
}

export function Sidebar({ version }: { version: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="shield" />
        </span>
        <div>
          <div className="brand-name">OpsDeck</div>
          <div className="brand-sub">Control plane</div>
        </div>
      </div>

      <div className="nav-group-label">Platform</div>
      <nav className="nav">
        {PLATFORM.map((link) => (
          <NavItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>

      <div className="nav-group-label">Operations</div>
      <nav className="nav">
        {OPERATIONS.map((link) => (
          <NavItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>

      <div className="nav-group-label">Platform</div>
      <nav className="nav">
        {PLATFORM_SECONDARY.map((link) => (
          <NavItem key={link.href} link={link} active={isActive(link.href)} />
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>OpsDeck core v{version}</span>
        <span>Modular DevOps platform</span>
      </div>
    </aside>
  );
}

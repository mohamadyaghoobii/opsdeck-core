import "./globals.css";
import type { Metadata } from "next";

import { Sidebar } from "@/components/Sidebar";
import { getSettingsStatus } from "@/lib/api";

export const metadata: Metadata = {
  title: "OpsDeck — Control plane",
  description: "Control plane for a modular DevOps and DevSecOps platform.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const status = await getSettingsStatus();
  const version = status.ok ? status.data.version : "0.2.0";

  return (
    <html lang="en">
      <body>
        <div className="app">
          <Sidebar version={version} />
          <div className="main">{children}</div>
        </div>
      </body>
    </html>
  );
}

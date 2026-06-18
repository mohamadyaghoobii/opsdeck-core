import { PageHeader } from "@/components/PageHeader";
import { Badge, Card, CardHeader, ErrorState } from "@/components/ui";
import { API_BASE, getSettingsStatus } from "@/lib/api";

export default async function StatusPage() {
  const result = await getSettingsStatus();

  return (
    <>
      <PageHeader title="System status" subtitle="Runtime configuration and connectivity of the OpsDeck API." />
      <div className="page-body">
        {!result.ok ? (
          <ErrorState message={result.error} />
        ) : (
          <section className="grid cols-2">
            <Card>
              <CardHeader title="API" />
              <div className="card-pad">
                <div className="kv">
                  <span className="k">Service</span>
                  <span className="v">{result.data.app_name}</span>
                </div>
                <div className="kv">
                  <span className="k">Version</span>
                  <span className="v mono">{result.data.version}</span>
                </div>
                <div className="kv">
                  <span className="k">Environment</span>
                  <span className="v">
                    <Badge tone={result.data.environment === "production" ? "accent" : "neutral"}>
                      {result.data.environment}
                    </Badge>
                  </span>
                </div>
                <div className="kv">
                  <span className="k">Base URL</span>
                  <span className="v mono">{API_BASE}</span>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Configuration" />
              <div className="card-pad">
                <div className="kv">
                  <span className="k">Database engine</span>
                  <span className="v">
                    <Badge tone="ok">{result.data.database}</Badge>
                  </span>
                </div>
                <div className="kv">
                  <span className="k">Seed on startup</span>
                  <span className="v">{result.data.seed_on_startup ? "enabled" : "disabled"}</span>
                </div>
                <div className="kv">
                  <span className="k">Allowed origins</span>
                  <span className="v">
                    <span className="tag-list">
                      {result.data.cors_origins.map((origin) => (
                        <span className="mono" key={origin}>
                          {origin}
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </>
  );
}

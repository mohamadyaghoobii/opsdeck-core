import { PageHeader } from "@/components/PageHeader";
import { Badge, Card, EmptyState, ErrorState } from "@/components/ui";
import { getProjects } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default async function ProjectsPage() {
  const result = await getProjects();

  return (
    <>
      <PageHeader title="Projects" subtitle="Services and codebases tracked in the platform inventory." />
      <div className="page-body">
        {!result.ok ? (
          <ErrorState message={result.error} />
        ) : result.data.length === 0 ? (
          <Card>
            <EmptyState title="No projects yet" message="Projects you onboard will be listed here." />
          </Card>
        ) : (
          <Card>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Owner</th>
                    <th>Environment</th>
                    <th>Repository</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div className="cell-title">{project.name}</div>
                        {project.description ? <div className="cell-sub">{project.description}</div> : null}
                      </td>
                      <td>{project.owner}</td>
                      <td>
                        <Badge tone={project.environment === "production" ? "accent" : "neutral"}>
                          {project.environment}
                        </Badge>
                      </td>
                      <td>
                        {project.repo_url ? (
                          <a className="mono" href={project.repo_url} target="_blank" rel="noreferrer">
                            {project.repo_url.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <span className="faint">—</span>
                        )}
                      </td>
                      <td className="muted">{formatDate(project.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

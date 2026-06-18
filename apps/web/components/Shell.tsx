const nav = ["Overview", "Projects", "Modules", "Scans", "Findings", "Reports", "Settings"];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span />OpsDeck</div>
        <p className="tagline">DevOps and DevSecOps control room for platform teams.</p>
        <nav>
          {nav.map((item) => <a key={item}>{item}</a>)}
        </nav>
      </aside>
      <section className="content">{children}</section>
    </main>
  );
}

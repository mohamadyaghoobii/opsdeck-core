export default function Loading() {
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Loading</h1>
          <p className="page-subtitle">Fetching the latest platform data…</p>
        </div>
      </header>
      <div className="page-body">
        <section className="grid cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="card stat" key={index}>
              <div className="stat-label">&nbsp;</div>
              <div className="stat-value muted">—</div>
              <div className="stat-hint">&nbsp;</div>
            </div>
          ))}
        </section>
        <section className="grid cols-2">
          <div className="card" style={{ height: 220 }} />
          <div className="card" style={{ height: 220 }} />
        </section>
      </div>
    </>
  );
}

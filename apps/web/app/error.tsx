"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Something went wrong</h1>
          <p className="page-subtitle">This view could not be rendered.</p>
        </div>
      </header>
      <div className="page-body">
        <div className="banner">
          <span>The page failed to load. The OpsDeck API may be unavailable.</span>
        </div>
        <div>
          <button
            onClick={reset}
            className="status-pill"
            style={{ cursor: "pointer", background: "var(--accent-soft)", borderColor: "var(--accent-border)" }}
          >
            Try again
          </button>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <header className="page-header">
        <div>
          <h1 className="page-title">Page not found</h1>
          <p className="page-subtitle">The page you are looking for does not exist.</p>
        </div>
      </header>
      <div className="page-body">
        <Link href="/" className="status-pill" style={{ width: "fit-content" }}>
          Back to overview
        </Link>
      </div>
    </>
  );
}

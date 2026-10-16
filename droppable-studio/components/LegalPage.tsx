import Link from "next/link";

/* Shell for the hidden legal pages (/privacy, /terms): same slim header as
   /inquiry, one readable text column. Linked from nowhere on the site. */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="inq-head">
        <Link href="/" className="brand">
          <img src="/logo-blue.png" alt="Droppable Studio logo" />
          Droppable&nbsp;Studio
        </Link>
        <Link href="/" className="inq-back">
          <span className="arr" aria-hidden="true">
            ←
          </span>{" "}
          Back to site
        </Link>
      </header>

      <main className="legal">
        <div className="wrap">
          <article className="legal-col">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="legal-date">Last updated: {updated}</p>
            {children}
          </article>
        </div>
      </main>
    </>
  );
}

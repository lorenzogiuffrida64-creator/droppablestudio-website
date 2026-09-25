import Link from "next/link";
import { LINKS } from "@/config/links";
import { FAQ } from "@/config/faq";

/* Pre-objection handling, set as a ledger like WhyLedger: the head holds the
   left column (sticky on desktop), the questions run down the right under
   hairline rules. Native <details> — keyboard- and screen-reader-accessible
   with no JS; the answer fades in (opacity + transform only). The FAQPage
   JSON-LD mirrors the same list for search results. */
export default function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="faq" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <p className="eyebrow rv">FAQ</p>
          <h2 className="rv d1">
            Before you <em>ask.</em>
          </h2>
          <p className="faq-sub rv d2">
            Still unsure? Ask us directly — we answer every inquiry.
          </p>
          <Link className="btn ghost rv d3" href={LINKS.inquiry}>
            Start a project <span className="arr">→</span>
          </Link>
        </div>

        <div className="faq-list">
          {FAQ.map(({ q, a }) => (
            <details className="faq-item rv" key={q}>
              <summary>
                <span className="faq-q">{q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p className="faq-a">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}

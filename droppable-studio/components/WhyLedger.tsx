/* The case for AI, laid out as a ledger.

   Composition recreated from the Osmo reference (DESIGN.md): a narrow left rail
   carrying a stamped mark and a handwritten annotation, the headline and the
   rows pushed into a wide right column, and the rows themselves split
   title-left / body-right under hairline rules.

   The palette and both typefaces stay the studio's — the annotation speaks in
   Apple Garamond italic rather than the reference's marker face, and the
   stamped meta lines use wide-tracked SF Pro rather than a mono cut, because
   the brand system carries no third font. */

type LedgerRow = {
  tag: string; // the row's subject — small stamped label
  metric: string; // the figure that anchors the row
  unit: string; // what the figure measures
  struck: string; // the old way, struck through
  claim: string; // ours, following it
};

const ROWS: LedgerRow[] = [
  {
    tag: "Budget",
    metric: "−60%",
    unit: "typical production cost",
    struck: "Crew, studio, models, reshoots.",
    claim: "One AI campaign costs less than one day on a traditional set.",
  },
  {
    tag: "Speed",
    metric: "72h",
    unit: "concept to delivery",
    struck: "Months of pre-production.",
    claim:
      "From brief to final cut in days — launch while the trend is still alive.",
  },
  {
    tag: "Re-hook",
    metric: "∞",
    unit: "hook variations",
    struck: "One ad, one shot at attention.",
    claim:
      "We regenerate endless hook variations from a single master — and re-capture the feed until it converts.",
  },
];

export default function WhyLedger() {
  return (
    <section className="why" id="why">
      <div className="wrap why-grid">
        <div className="why-rail rv">
          {/* the stamp — mark plus the section's own meta, set like a colophon */}
          <span className="why-mark">
            <span className="why-mark-top">
              <img src="/logo-sage.png" alt="" aria-hidden="true" />
              <span className="why-mark-flag">
                Why
                <br />
                AI
              </span>
            </span>
            <span className="why-mark-line">
              Droppable Studio <i aria-hidden="true">✳</i> the ledger
            </span>
            <span className="why-mark-line">01 ——— 03</span>
          </span>

          <p className="why-note">
            Why AI?
            <svg viewBox="0 0 116 78" fill="none" aria-hidden="true">
              <path
                d="M9 8C33 7 72 19 90 55"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M76 45 92 58 87 41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        </div>

        <div className="why-main">
          <h2 className="rv d1">
            Traditional production is <em>obsolete.</em>
          </h2>

          <div className="ledger">
            {ROWS.map((row) => (
              <div className="row rv" key={row.tag}>
                <div className="row-lead">
                  <span className="tag">{row.tag}</span>
                  <b className="metric">{row.metric}</b>
                  <span className="metric-unit">{row.unit}</span>
                </div>
                <p className="claim">
                  <s>{row.struck}</s> {row.claim}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

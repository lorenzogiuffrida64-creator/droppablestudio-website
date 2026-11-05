import type { CSSProperties } from "react";
import {
  PARTS,
  QUESTION_COUNT,
  STEPS,
  TOTAL_MINUTES,
} from "@/config/hiring-questions";

/* /apply — the Loom video brief. Content lives in config/hiring-questions.ts;
   these components only lay it out. Every CTA targets #submit (ApplyForm). */

export function ApplyHero() {
  return (
    <section className="hq-hero">
      <div className="wrap">
        <h1>
          Join the <em>Droppable Team</em>
        </h1>
        <p className="hq-hero-lede">
          Record <strong>ONE</strong> Loom video answering the questions below,
          in order.
        </p>
        <a className="btn hq-hero-cta" href="#submit">
          Submit your Loom{" "}
          <span className="arr" aria-hidden="true">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}

/* three steps as a pipeline: numbered nodes joined by one line —
   across on desktop, down on mobile. Static, no JS. */
export function ApplySteps() {
  return (
    <section className="hq-section" aria-labelledby="hq-steps-title">
      <div className="wrap">
        <header className="hq-head">
          <h2 id="hq-steps-title" className="hq-h2">
            How to <em>apply.</em>
          </h2>
        </header>
        <ol className="hq-pipe" role="list">
          {STEPS.map((s, i) => (
            <li key={s.title} className="hq-pipe-step">
              <span className="hq-pipe-node" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="hq-pipe-title">{s.title}</h3>
              <p className="hq-pipe-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function QuestionParts() {
  let n = 0; // continuous question numbering across parts
  return (
    <section className="hq-section" aria-labelledby="hq-questions-title">
      {/* centred head, then the parts as FAQ-style rows (hairline ledger) —
          always open, nothing to click */}
      <div className="wrap">
        <header className="hq-head">
          <h2 id="hq-questions-title" className="hq-h2">
            The <em>questions.</em>
          </h2>
          <p className="hq-sub">
            Answer all {QUESTION_COUNT}, in this order, in one video.
          </p>
          <p className="hq-total">
            About <b>{TOTAL_MINUTES} minutes</b> in total.
          </p>
        </header>

        <div className="faq-list hq-q-list">
          {PARTS.map((part, i) => {
            const start = n + 1;
            n += part.questions.length;
            const range = start === n ? `Q${start}` : `Q${start}–${n}`;
            return (
              <article
                key={part.title}
                className="faq-item hq-part"
                aria-labelledby={`hq-part-${i + 1}`}
              >
                <header className="hq-part-head">
                  <span className="hq-sum">
                    <span className="hq-part-num">
                      Part {i + 1} · {range}
                    </span>
                    <h3 className="faq-q" id={`hq-part-${i + 1}`}>
                      {part.title}
                    </h3>
                    <span className="hq-part-meta">
                      {part.minutes} min
                      {part.screenShare && (
                        <>
                          {" · "}
                          <b>Screen share</b>
                        </>
                      )}
                    </span>
                  </span>
                </header>

                <div className="hq-part-body">
                  <ol
                    className="hq-qs"
                    role="list"
                    start={start}
                    style={{ counterReset: `hq ${start - 1}` } as CSSProperties}
                  >
                    {part.questions.map((q, j) => (
                      <li key={j} className="hq-q">
                        <p>{q.text}</p>
                        {q.followUp && <p className="hq-follow">{q.followUp}</p>}
                        {q.bullets && (
                          <ul className="hq-bullets">
                            {q.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ol>

                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

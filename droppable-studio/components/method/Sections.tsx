import Link from "next/link";
import { LINKS } from "@/config/links";
import { WORK } from "@/config/work";
import { BONUSES, METHOD, SCHOOL } from "@/config/method";
import Founders from "@/components/method/Founders";
import PreorderForm from "@/components/PreorderForm";
import {
  LadderCompact,
  LadderFull,
  SeatButton,
  FinalLine,
  OnlyIn,
} from "@/components/method/Pricing";
import {
  FounderVideo,
  VideoFrame,
  ProofReel,
  ClassroomCarousel,
  TestimonialReel,
} from "@/components/method/Media";
import { FaqList } from "@/components/method/Tracking";

const DEV = process.env.NODE_ENV !== "production";

/* Missing content renders nothing — in development too. The labels stay in
   the code as a checklist of what's still to provide. */
function Todo(_props: { label: string }) {
  return null;
}

/* ---------- 5.2 hero ---------- */
export function Hero() {
  const { hero, founderVideo } = METHOD;
  return (
    <section className="m-hero" id="hero">
      <div className="wrap m-hero-grid">
        <div className="m-hero-head">
          <h1>
            {hero.headline} <em>{hero.headlineAccent}</em>
          </h1>
          <p className="m-hero-sub">{hero.sub}</p>
        </div>

        <div className="m-hero-media">
          {founderVideo ? (
            <FounderVideo {...founderVideo} />
          ) : (
            <>
              <VideoFrame />
              <Todo label="FOUNDER_VIDEO + POSTER (16:9, captions burned in)" />
            </>
          )}
        </div>

        <div className="m-hero-buy">
          <LadderCompact />
          <OnlyIn state="preorder">
            <p className="m-hero-when">
              One payment today. Full access the day the school opens.
            </p>
          </OnlyIn>
          <SeatButton source="hero_cta_click" className="btn m-cta" />
          <Counter />
          <OnlyIn state="preorder">
            <p className="m-trust">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout with Stripe
            </p>
          </OnlyIn>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5.4 the work ---------- */
export function Work() {
  return (
    <section className="m-band m-work" aria-labelledby="m-work-h">
      <div className="wrap">
        <h2 id="m-work-h">This is the level.</h2>
        <p className="m-work-note">
          Every one of these was made with AI in our studio.
        </p>
      </div>
      <ProofReel items={WORK} />
    </section>
  );
}

/* ---------- 5.6 what's inside ---------- */
export function Inside() {
  const { classroom } = METHOD;
  return (
    <section className="m-section m-inside" aria-labelledby="m-inside-h">
      <div className="wrap">
        <div className="m-inside-grid">
          <div className="m-count">
            <b>{SCHOOL.lessonCount}</b>
            <span>lessons</span>
          </div>
          <div>
            <h2 id="m-inside-h">What&apos;s inside</h2>
            <ul className="m-ledger">
              {SCHOOL.includes.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>


        {classroom.length > 0 && <ClassroomCarousel shots={classroom} />}
      </div>
    </section>
  );
}

/* ---------- founders-only bonuses (components/method/Founders.tsx) ---------- */
export function Bonuses() {
  return <Founders />;
}

/* ---------- 5.7 the path ---------- */
export function Path() {
  return (
    <section className="m-section m-path" aria-labelledby="m-path-h">
      <div className="wrap">
        <h2 id="m-path-h">From first render to your own agency.</h2>
        <ol className="m-steps">
          {METHOD.path.map((s, i) => (
            <li key={s.title}>
              <span className="m-step-n">{i + 1}</span>
              <b>{s.title}</b>
              <span>{s.line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 5.8 the mentors ---------- */
export function Founder() {
  const { mentors } = METHOD;
  if (!mentors.length) return null;
  return (
    <section className="m-section m-mentors" aria-labelledby="m-mentors-h">
      <div className="wrap">
        <h2 id="m-mentors-h">Your mentors.</h2>
        <ul className="mentors">
          {mentors.map((m) => (
            <li className="mentor" key={m.name}>
              <img
                src={`${m.photo}-1000.webp`}
                srcSet={`${m.photo}-600.webp 600w, ${m.photo}-1000.webp 1000w`}
                sizes="(max-width: 860px) 92vw, 540px"
                width={1000}
                height={1250}
                alt={`${m.name}, ${m.role}`}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: m.focus }}
              />
              <div className="mentor-cap">
                <span className="mentor-role">{m.role}</span>
                <b className="mentor-name">{m.name}</b>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- testimonials — straight under the hero CTA ---------- */
export function Testimonials() {
  const { clips, chats } = METHOD.testimonials;
  if (!clips.length && !chats.length) return null;
  return (
    <section className="m-section m-testi" aria-labelledby="m-testi-h">
      <div className="wrap">
        <div className="m-testi-head">
          <h2 id="m-testi-h">Straight from our students.</h2>
          <p>Real calls and real messages from people we&apos;ve taught.</p>
        </div>
      </div>
      {clips.length > 0 && <TestimonialReel clips={clips} />}
      {chats.length > 0 && (
        <div className="wrap">
          <ul className="chats" aria-label="Messages from students">
            {chats.map((c) => (
              <li
                className={c.full ? "chat chat-full" : "chat"}
                key={c.src}
                style={c.full ? { aspectRatio: `${c.width} / ${c.height}` } : undefined}
              >
                <img
                  src={c.src}
                  width={c.width}
                  height={c.height}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ---------- 5.10 the offer — the one real buy button lives here ---------- */
export function Offer() {
  return (
    <section
      className="m-band m-offer"
      id="checkout"
      aria-labelledby="m-offer-h"
    >
      <div className="wrap">
        <OnlyIn state="preorder">
          <h2 id="m-offer-h">Lock your founding price.</h2>
          <p className="m-offer-sub">
            The price goes up every day at midnight CET.
          </p>
        </OnlyIn>
        <OnlyIn state="launch">
          <h2 id="m-offer-h">The Droppable Method is open.</h2>
        </OnlyIn>

        <OnlyIn state="preorder">
          <LadderFull />
          {METHOD.foundingKeeps ? (
            <p className="m-keeps">{METHOD.foundingKeeps}</p>
          ) : (
            <Todo label="FOUNDING_KEEPS — what founding members keep (input #1: monthly-locked or one-time)" />
          )}
        </OnlyIn>

        <div className="m-offer-card">
          <ul className="m-offer-includes">
            <li>{SCHOOL.lessonCount} lessons + everything inside</li>
            <OnlyIn state="preorder">
              {BONUSES.map((b) => (
                <li key={b.id}>
                  <b>+</b> {b.title}
                </li>
              ))}
            </OnlyIn>
          </ul>
          <OnlyIn state="preorder">
            <PreorderForm />
          </OnlyIn>
          <OnlyIn state="launch">
            <SeatButton source="final_cta_click" className="btn m-cta" />
          </OnlyIn>
          <Counter />
        </div>
      </div>
    </section>
  );
}

/* ---------- 6.3 founding-member counter (hidden under the threshold) ---------- */
function Counter() {
  const { counter } = METHOD;
  if (counter.value < counter.minToShow) return null;
  return (
    <p className="m-counter">
      <span className="m-counter-dot" aria-hidden="true" />
      <b className="tnum">
        {counter.value}
        {counter.plus ? "+" : ""}
      </b>{" "}
      {counter.label}
    </p>
  );
}

/* ---------- 5.11 FAQ — school questions only, answered ones only ---------- */
export function Faq() {
  const answered = METHOD.faq.filter((f) => f.a);
  const missing = METHOD.faq.filter((f) => !f.a);
  if (!answered.length && !DEV) return null;
  return (
    <section className="m-section faq m-faq" aria-labelledby="m-faq-h">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 id="m-faq-h">
            <OnlyIn state="preorder">Before you pre&#8209;order.</OnlyIn>
            <OnlyIn state="launch">Before you join.</OnlyIn>
          </h2>
        </div>
        <div>
          <FaqList items={answered} />
          {missing.length > 0 && (
            <Todo
              label={`FAQ_ANSWERS: ${missing.map((f) => f.q).join(" · ")}`}
            />
          )}
        </div>
      </div>
      {answered.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: answered.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            }),
          }}
        />
      )}
    </section>
  );
}

/* ---------- 5.12 final CTA ---------- */
export function FinalCta() {
  return (
    <section className="m-section m-final">
      <div className="wrap">
        <FinalLine />
        <SeatButton source="final_cta_click" className="btn m-cta" />
      </div>
    </section>
  );
}

export function Foot() {
  return (
    <footer className="m-foot" id="m-foot">
      <div className="wrap m-foot-row">
        <Link href="/" className="m-foot-brand">
          <img src="/logo-sage.png" alt="" width={28} height={28} />
          Droppable Studio
        </Link>
        <nav aria-label="Footer">
          <a href={LINKS.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
          <a href={LINKS.discord} target="_blank" rel="noopener">
            Discord
          </a>
          <Link href="/">Main site</Link>
        </nav>
        <span className="m-foot-c">
          © {new Date().getFullYear()} Droppable Studio
        </span>
      </div>
    </footer>
  );
}

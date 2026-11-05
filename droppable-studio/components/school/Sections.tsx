import Link from "next/link";
import { LINKS } from "@/config/links";
import { WORK } from "@/config/work";
import { school, monthsFree, trialLine } from "@/config/school";
import {
  HERO,
  HERO_VIDEO,
  TESTIMONIALS,
  CHALLENGE,
  ROADMAP,
  CLASSROOM,
  INSIDE,
  GO_FURTHER,
  FAQ,
} from "@/config/school-page";
import { MEMBER_WINS } from "@/config/member-wins";
import {
  FounderVideo,
  ProofReel,
  ClassroomCarousel,
  TestimonialReel,
} from "@/components/school/Media";
import { SkoolCta, UrgencyStrip, FaqList } from "@/components/school/Client";

/* "$147/month · Cancel anytime · 7-day free trial" under the main CTAs */
function PriceNote() {
  const trial = trialLine();
  return (
    <p className="s-note">
      <span>
        <b>{school.priceMonthly}</b>/month
      </span>
      <span aria-hidden="true">·</span>
      <span>Cancel anytime</span>
      {trial && (
        <>
          <span aria-hidden="true">·</span>
          <span>{trial}</span>
        </>
      )}
    </p>
  );
}

/* social proof, only when Lorenzo sets a real number */
function Members() {
  if (school.foundingMembers == null) return null;
  return (
    <p className="m-counter">
      <span className="m-counter-dot" aria-hidden="true" />
      <b className="tnum">{school.foundingMembers.toLocaleString("en-US")}</b>{" "}
      members inside
    </p>
  );
}

/* ---------- hero ---------- */
export function Hero() {
  return (
    <section className="m-hero" id="hero">
      <div className="wrap m-hero-grid">
        <div className="m-hero-head">
          <h1>
            {HERO.headline} <em>{HERO.headlineAccent}</em>
          </h1>
          <p className="m-hero-sub s-hero-sub">{HERO.sub}</p>
        </div>

        {HERO_VIDEO && (
          <div className="m-hero-media">
            <FounderVideo {...HERO_VIDEO} />
          </div>
        )}

        <div className="m-hero-buy">
          <SkoolCta placement="hero">{HERO.cta}</SkoolCta>
          <PriceNote />
          <Members />
          <UrgencyStrip />
        </div>
      </div>
    </section>
  );
}

/* ---------- proof first ---------- */
export function Testimonials() {
  const { clips, chats } = TESTIMONIALS;
  if (!clips.length && !chats.length && !MEMBER_WINS.length) return null;
  return (
    <section className="m-section m-testi" aria-labelledby="m-testi-h">
      <div className="wrap">
        <div className="m-testi-head">
          <h2 id="m-testi-h">Straight from our students.</h2>
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
      <MemberWins />
    </section>
  );
}

/* fed from config/member-wins.ts; hidden while the list is empty */
function MemberWins() {
  if (!MEMBER_WINS.length) return null;
  return (
    <div className="wrap s-wins">
      <h3>Member wins</h3>
      <ul className="s-wins-grid">
        {MEMBER_WINS.map((w) => (
          <li key={`${w.name}-${w.media.src}`} className="s-win">
            <div className="s-win-media">
              {w.media.type === "video" ? (
                <video
                  src={w.media.src}
                  poster={w.media.poster}
                  muted
                  loop
                  playsInline
                  controls
                  preload="none"
                />
              ) : (
                <img src={w.media.src} alt={w.media.alt} loading="lazy" decoding="async" />
              )}
            </div>
            <b>{w.name}</b>
            <span>{w.line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- this is the level ---------- */
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

/* ---------- the 7-Day Challenge: the core of the page ---------- */
export function Challenge() {
  return (
    <section className="m-section s-challenge" id="challenge" aria-labelledby="s-ch-h">
      <div className="wrap">
        <p className="eyebrow">The 7-Day Challenge</p>
        <h2 id="s-ch-h">
          {CHALLENGE.title} <em>{CHALLENGE.titleAccent}</em>
        </h2>
        <ol className="s-days">
          {CHALLENGE.days.map((d, i) => (
            <li key={d}>
              <span className="s-day-n">Day {i + 1}</span>
              <b>{d}</b>
            </li>
          ))}
        </ol>
        <p className="s-challenge-note">{CHALLENGE.note}</p>
        {school.cohortBonus && (
          <p className="s-bonus">
            <span>Bonus</span>
            {school.cohortBonus}
          </p>
        )}
        <div className="s-challenge-cta">
          <SkoolCta placement="challenge">{HERO.cta}</SkoolCta>
          <PriceNote />
        </div>
      </div>
    </section>
  );
}

/* ---------- the 90-day roadmap ---------- */
export function Roadmap() {
  return (
    <section className="m-section m-path s-roadmap" aria-labelledby="m-path-h">
      <div className="wrap">
        <h2 id="m-path-h">
          Your first 90 days, <em>mapped.</em>
        </h2>
        <ol className="m-steps">
          {ROADMAP.map((s, i) => (
            <li key={s.title}>
              <span className="m-step-n">{i + 1}</span>
              <span className="s-step-when">{s.when}</span>
              <b>{s.title}</b>
              <span>{s.line}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- look inside the classroom ---------- */
export function Classroom() {
  return (
    <section className="m-section s-classroom" aria-label="Look inside the classroom">
      <div className="wrap">
        <ClassroomCarousel shots={CLASSROOM} />
      </div>
    </section>
  );
}

/* ---------- what's inside ---------- */
export function Inside() {
  return (
    <section className="m-section m-inside" aria-labelledby="m-inside-h">
      <div className="wrap">
        <div className="m-inside-grid">
          <div className="m-count">
            <b>{school.lessons}</b>
            <span>lessons</span>
          </div>
          <div>
            <h2 id="m-inside-h">What&apos;s inside</h2>
            <ul className="m-ledger s-ledger">
              {INSIDE.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- pricing ---------- */
export function Pricing() {
  const free = monthsFree();
  return (
    <section className="m-band m-offer" id="pricing" aria-labelledby="s-price-h">
      <div className="wrap">
        <h2 id="s-price-h">
          Pick your plan. <em>Start today.</em>
        </h2>
        <div className={`s-plans${school.priceYearly ? "" : " is-single"}`}>
          <div className="s-plan">
            <span className="s-plan-k">Monthly</span>
            <p className="s-plan-price">
              {school.priceMonthly}
              <small>/mo</small>
            </p>
            <p className="s-plan-line">Everything inside. Billed monthly.</p>
            <SkoolCta placement="pricing" className="btn ghost">
              Join monthly
            </SkoolCta>
          </div>
          {school.priceYearly && (
            <div className="s-plan is-best">
              <span className="s-plan-badge">Best value</span>
              <span className="s-plan-k">Yearly</span>
              <p className="s-plan-price">
                {school.priceYearly}
                <small>/yr</small>
              </p>
              <p className="s-plan-line">
                {free && <b>≈ {free} months free. </b>}
                Includes the Weekly AI Insider.
              </p>
              <SkoolCta placement="pricing" className="btn">
                Join yearly
              </SkoolCta>
            </div>
          )}
        </div>
        <p className="s-plans-note">
          Cancel anytime from your Skool settings.
          {trialLine() && <> {trialLine()}.</>}
        </p>
      </div>
    </section>
  );
}

/* ---------- go further: apply-only, no prices ---------- */
export function GoFurther() {
  return (
    <section className="m-section s-further" aria-labelledby="s-further-h">
      <div className="wrap">
        <h3 id="s-further-h">Go further with us.</h3>
        <div className="paths">
          {GO_FURTHER.map((g) => (
            <div className="path-card" key={g.id}>
              <span className="tier">Apply only</span>
              <h3>{g.title}</h3>
              <p className="path-lede">{g.line}</p>
              <Link className="btn ghost" href={g.href}>
                Apply <span className="arr">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- your mentors ---------- */
export function Mentors() {
  const { mentors } = school;
  if (!mentors.length) return null;
  return (
    <section className="m-section m-mentors" aria-labelledby="m-mentors-h">
      <div className="wrap">
        <h2 id="m-mentors-h">Your mentors.</h2>
        <ul className="mentors">
          {mentors.map((m) => (
            <li className="mentor" key={m.name}>
              {m.photo ? (
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
              ) : (
                <div className="mentor-veil" aria-hidden="true">
                  <i /><i /><i />
                </div>
              )}
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

/* ---------- FAQ ---------- */
export function Faq() {
  return (
    <section className="m-section faq m-faq" aria-labelledby="m-faq-h">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 id="m-faq-h">
            Before you <em>join.</em>
          </h2>
        </div>
        <div>
          <FaqList items={FAQ} />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </section>
  );
}

/* ---------- final CTA ---------- */
export function FinalCta() {
  return (
    <section className="m-section m-final" id="final">
      <div className="wrap">
        <h2>
          Your first AI ad is <em>7 days away.</em>
        </h2>
        <div className="s-final-buy">
          <SkoolCta placement="final">{HERO.cta}</SkoolCta>
          <PriceNote />
          <UrgencyStrip />
        </div>
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

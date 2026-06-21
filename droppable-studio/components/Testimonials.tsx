import { TESTIMONIALS, type Testimonial } from "@/config/testimonials";

/* derive initials for the avatar fallback ("Elena Marchetti" -> "EM") */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Card({ t, hidden }: { t: Testimonial; hidden?: boolean }) {
  return (
    <figure className="testi-card" aria-hidden={hidden || undefined}>
      {t.avatar ? (
        <img
          className="testi-avatar"
          src={t.avatar}
          alt={t.name}
          width={64}
          height={64}
          loading="lazy"
        />
      ) : (
        <span className="testi-avatar testi-avatar-fallback" aria-hidden="true">
          {initials(t.name)}
        </span>
      )}
      <blockquote className="testi-quote">“{t.quote}”</blockquote>
      <figcaption className="testi-cite">
        <b>{t.name},</b> {t.role}
      </figcaption>
    </figure>
  );
}

/* Continuous right-to-left loop. Reuses the marquee technique: a single track
   holding the list twice, slid by -50% (@keyframes slide). Per-card spacing is
   baked into the card (margin), like .marquee span's padding, so the half-width
   wrap is seamless. The real list reads once; the second copy is aria-hidden so
   screen readers don't hear duplicates. Pure CSS — paused on hover, frozen under
   prefers-reduced-motion (where the track becomes a normal scroll row). */
export default function Testimonials() {
  return (
    <section className="testi-section" id="testimonials">
      <div className="wrap">
        <div className="testi-head">
          <p className="eyebrow rv">Proof</p>
          <h2 className="rv d1">What our clients say</h2>
        </div>
      </div>

      <div className="testi">
        <div className="testi-track">
          {TESTIMONIALS.map((t, i) => (
            <Card key={`a-${i}`} t={t} />
          ))}
          {TESTIMONIALS.map((t, i) => (
            <Card key={`b-${i}`} t={t} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}

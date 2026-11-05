"use client";

import { useEffect, useState } from "react";
import {
  school,
  skoolHref,
  cohortLabel,
  formatCohortDate,
  formatCountdown,
  type CtaPlacement,
} from "@/config/school";
import type { FaqItem } from "@/config/school-page";
import { track, readUtms } from "@/lib/track";

/* ---------- the one checkout: Skool, same tab, UTM per placement ---------- */
export function SkoolCta({
  placement,
  children,
  className = "btn m-cta",
}: {
  placement: CtaPlacement;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={skoolHref(placement)}
      onClick={() => track("school_cta_click", { placement })}
    >
      {children}
    </a>
  );
}

/* wall clock, null until mounted so the static HTML never shows a stale time */
function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------- urgency strip: only the parts whose config isn't null ----------
   Cohort date and price line are static; the countdown appears once mounted
   and disappears when enrolment has closed. */
export function UrgencyStrip({ className = "" }: { className?: string }) {
  const now = useNow();
  const cohort =
    now == null
      ? school.nextCohortDate && formatCohortDate(school.nextCohortDate)
      : cohortLabel(now);
  const closes = school.enrolmentCloses ? Date.parse(school.enrolmentCloses) : null;
  const left = closes != null && now != null && closes > now ? closes - now : null;
  /* reserve the countdown's space before mount so nothing shifts */
  const pendingClock = closes != null && now == null;

  if (!cohort && closes == null && !school.nextPrice) return null;
  return (
    <div className={`s-urgency ${className}`}>
      {(cohort || left != null || pendingClock) && (
        <p className="s-urgency-row">
          {cohort && (
            <span>
              Next cohort starts <b>{cohort}</b>
            </span>
          )}
          {(left != null || pendingClock) && (
            <span role="timer" className={pendingClock ? "is-pending" : undefined}>
              <span className="s-urgency-dot" aria-hidden="true" />
              Enrolment closes in{" "}
              <b className="tnum">{left != null ? formatCountdown(left) : "0d 00:00:00"}</b>
            </span>
          )}
        </p>
      )}
      {school.nextPrice && (
        <p className="s-urgency-price">
          Price goes up to {school.nextPrice} for new members. Yours stays
          locked while you&apos;re subscribed.
        </p>
      )}
    </div>
  );
}

/* ---------- sticky mobile CTA ----------
   Shows once the hero has scrolled away; hides over the pricing, final CTA
   and footer so it never sits on top of the button it repeats. */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const blockers = ["pricing", "final", "m-foot"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const seen = new Set<Element>();
    const heroIo = new IntersectionObserver(([e]) =>
      setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0)
    );
    const blockIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setBlocked(seen.size > 0);
    });
    if (hero) heroIo.observe(hero);
    blockers.forEach((b) => blockIo.observe(b));
    return () => {
      heroIo.disconnect();
      blockIo.disconnect();
    };
  }, []);

  const show = pastHero && !blocked;
  return (
    <div className={`m-sticky${show ? " is-on" : ""}`} inert={!show}>
      <p className="m-sticky-price">
        <b>{school.priceMonthly}</b>/month
      </p>
      <SkoolCta placement="sticky" className="btn">
        Start now
      </SkoolCta>
    </div>
  );
}

/* page_view with UTMs, once per load */
export function PageView() {
  useEffect(() => {
    track("page_view", { page: "school", ...readUtms() });
  }, []);
  return null;
}

/* native <details> accordion; opening one sends faq_open with its id */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map(({ id, q, a, links }) => (
        <details
          className="faq-item"
          key={id}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) track("faq_open", { id });
          }}
        >
          <summary>
            <span className="faq-q">{q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p className="faq-a">
            {a}
            {links?.map((l) => (
              <a key={l.href} className="s-faq-link" href={l.href}>
                {l.label} <span className="arr" aria-hidden="true">→</span>
              </a>
            ))}
          </p>
        </details>
      ))}
    </div>
  );
}

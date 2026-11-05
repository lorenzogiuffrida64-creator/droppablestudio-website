/**
 * The Droppable Method (Skool) — every changeable fact in one place.
 * /school, the homepage Academy card and the FAQ all read from here.
 *
 * Rule: never invent a number. A `null` value hides its element cleanly.
 */
export const school = {
  skoolUrl: "https://www.skool.com/droppablestudio-ai-school-7941/about",
  /* must match what Skool actually charges (Skool bills in USD) */
  priceMonthly: "$147",
  priceYearly: "$997" as string | null,
  /* shown in the "price goes up" line; null = hide */
  nextPrice: "$167" as string | null,
  lessons: 104,
  phases: 7,
  /* 7-Day Challenge start (YYYY-MM-DD); null = hide all cohort UI */
  nextCohortDate: "2026-11-09" as string | null,
  /* countdown target; null = no countdown */
  enrolmentCloses: "2026-11-08T23:59:00+01:00" as string | null,
  /* 0 = hide every trial mention; 7 = show "7-day free trial" */
  freeTrialDays: 0,
  cohortBonus: "Live spec-ad review with Lorenzo for this cohort" as string | null,
  /* number to show as social proof; null = hide (don't guess) */
  foundingMembers: null as number | null,
  /* "Why should I learn this from you?" proof points; null = left out */
  brandsWorkedWith: null as number | null,
  mentors: [
    {
      name: "Lorenzo Giuffrida",
      role: "Founder of Droppable Studio & AI visual director",
      photo: "/method/mentors/lorenzo" as string | undefined,
      /* where the face sits, so the crop keeps it on narrow screens */
      focus: "55% 40%" as string | undefined,
    },
    {
      name: "Matteo",
      role: "Founder of Core Unlock, teaches AI Agency & Scaling",
      photo: undefined as string | undefined,
      focus: undefined as string | undefined,
    },
  ],
};

export type CtaPlacement = "hero" | "challenge" | "pricing" | "final" | "sticky";

/** Skool URL with the UTM set for one placement on /school. */
export function skoolHref(placement: CtaPlacement): string {
  const url = new URL(school.skoolUrl);
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", "school_page");
  url.searchParams.set("utm_content", placement);
  return url.toString();
}

const amount = (price: string) => Number(price.replace(/[^0-9.]/g, ""));

/** Whole months the yearly plan saves vs 12 × monthly, e.g. $147 / $997 → 5. */
export function monthsFree(): number | null {
  if (!school.priceYearly) return null;
  const m = amount(school.priceMonthly);
  const y = amount(school.priceYearly);
  if (!m || !y) return null;
  const free = Math.floor((m * 12 - y) / m);
  return free > 0 ? free : null;
}

/** "2026-11-09" → "Mon 9 Nov" (same string on server and client). */
export function formatCohortDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(Date.parse(`${date}T12:00:00Z`));
}

/** Cohort date to display, or null when unset or already started. */
export function cohortLabel(now: number = Date.now()): string | null {
  const d = school.nextCohortDate;
  if (!d) return null;
  /* hide once the start day is over */
  if (now > Date.parse(`${d}T23:59:59Z`)) return null;
  return formatCohortDate(d);
}

/** Remaining time as "9d 04:12:33" (days dropped under 24h). */
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(
    Math.floor((s % 3600) / 60)
  )}:${pad(s % 60)}`;
  return d > 0 ? `${d}d ${hms}` : hms;
}

export const trialLine = () =>
  school.freeTrialDays > 0 ? `${school.freeTrialDays}-day free trial` : null;

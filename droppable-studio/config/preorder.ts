/**
 * Pre-order pricing — single source of truth for the Skool card, the /preorder
 * landing page, the Stripe Checkout route and the confirmation emails (so the
 * number never drifts between them). Every date and price on the page comes
 * from here.
 *
 * The Skool community is still being built; this is a founding pre-order paid
 * up front via Stripe Checkout, on a rising schedule: the price steps up at
 * midnight (CET) every day, and the Skool opens at `launchAt`.
 * Checkout charges whatever `priceAt()` says at request time (server side), so
 * editing `schedule` is all it takes to change the price.
 *
 * No crossed-out reference prices anywhere (EU Omnibus / AGCM): the page shows
 * a price ladder — today / tomorrow / launch — instead.
 */
export const PREORDER = {
  currency: "eur" as const,
  timezone: "Europe/Rome",
  /* the Skool price once it opens (SOP §2: €150/month) */
  launchPriceCents: 15000,
  launchBilling: "month" as const,
  /* price before the first step below */
  startPriceCents: 1400,
  /* each entry = the price from that midnight (Europe/Rome, CEST +02:00) on */
  schedule: [
    { from: Date.parse("2026-09-30T00:00:00+02:00"), cents: 2100 },
    { from: Date.parse("2026-10-01T00:00:00+02:00"), cents: 2800 },
    { from: Date.parse("2026-10-02T00:00:00+02:00"), cents: 3500 },
    { from: Date.parse("2026-10-03T00:00:00+02:00"), cents: 4200 },
    { from: Date.parse("2026-10-04T00:00:00+02:00"), cents: 4900 },
    { from: Date.parse("2026-10-05T00:00:00+02:00"), cents: 5600 },
    { from: Date.parse("2026-10-06T00:00:00+02:00"), cents: 5700 },
  ],
  /* the Skool opens: the pre-order closes and the page switches to launch mode */
  launchAt: Date.parse("2026-10-06T14:00:00+02:00"),
  productName: "The Droppable Method — Founding Pre-order",
  productDescription:
    "Founding member seat in the Droppable Method (Skool). Full access when the community opens.",
} as const;

const DAY = 86_400_000;

export type PreorderPrice = {
  cents: number;
  /* next price and when it kicks in (null after the last step) */
  nextCents: number | null;
  nextAt: number | null;
};

/** Price in effect at `now` (ms since epoch). */
export function priceAt(now: number): PreorderPrice {
  const { schedule, startPriceCents } = PREORDER;
  let cents: number = startPriceCents;
  let next: (typeof schedule)[number] | null = null;
  for (const step of schedule) {
    if (step.from <= now) cents = step.cents;
    else {
      next = step;
      break;
    }
  }
  return {
    cents,
    nextCents: next?.cents ?? null,
    nextAt: next?.from ?? null,
  };
}

export type LaunchState = "preorder" | "launch";

/** Page state derived from the clock: the switch at `launchAt` is automatic. */
export function stateAt(now: number): LaunchState {
  return now >= PREORDER.launchAt ? "launch" : "preorder";
}

export type LadderStep = {
  cents: number;
  /* when this price starts (the opening step starts a day before step 1) */
  from: number;
  status: "passed" | "today" | "upcoming";
};

/** Every pre-order price step with its status at `now` — the full ladder. */
export function ladderAt(now: number): LadderStep[] {
  const { schedule, startPriceCents } = PREORDER;
  const steps = [
    { from: schedule[0].from - DAY, cents: startPriceCents },
    ...schedule,
  ];
  return steps.map((s, i) => {
    const end = steps[i + 1]?.from ?? PREORDER.launchAt;
    const status =
      now >= end ? "passed" : now >= s.from || i === 0 ? "today" : "upcoming";
    return { cents: s.cents, from: s.from, status };
  });
}

/** Format an integer amount of cents as a EUR string, e.g. 700 → "€7". */
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  /* drop ".00" for whole euros, keep cents otherwise (e.g. €7, €14.50) */
  const body = Number.isInteger(euros) ? String(euros) : euros.toFixed(2);
  return `€${body}`;
}

/** "€14/mo" — every pre-order price is shown as a monthly rate */
export function formatMonthly(cents: number): string {
  return `${formatPrice(cents)}/mo`;
}

/** "€150/mo" */
export function formatLaunchPrice(): string {
  return `${formatPrice(PREORDER.launchPriceCents)}/mo`;
}

/** Date in Rome time — the same string on server and client, e.g. "Tue 6 Oct". */
export function formatDay(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PREORDER.timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(ms);
}

/** Time in Rome, e.g. "14:00". */
export function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PREORDER.timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(ms);
}

/** Remaining time as "7d 02:31:45" (days dropped under 24h). */
export function formatCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const pad = (n: number) => String(n).padStart(2, "0");
  const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(
    Math.floor((s % 3600) / 60)
  )}:${pad(s % 60)}`;
  return d > 0 ? `${d}d ${hms}` : hms;
}

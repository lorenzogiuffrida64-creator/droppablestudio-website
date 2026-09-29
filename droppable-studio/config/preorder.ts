/**
 * Pre-order pricing — single source of truth for the Skool card, the pre-order
 * form, the Stripe Checkout route and the confirmation emails (so the number
 * never drifts between them). See the plan + CLAUDE.md (Academy funnel).
 *
 * The Skool community is still being built; this is a founding pre-order paid
 * up front via Stripe Checkout, on a rising schedule: the price steps up at
 * midnight (Italian time) every day until it reaches the full Skool price, and
 * the Skool opens at `launchAt`. Checkout charges whatever `priceAt()` says at
 * request time, so editing `schedule` is all it takes to change the price.
 */
export const PREORDER = {
  currency: "eur" as const,
  /* struck-through "launch" price — the full Skool price */
  launchPriceCents: 5700,
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
  /* the Skool opens (release countdown) */
  launchAt: Date.parse("2026-10-06T14:00:00+02:00"),
  productName: "The Droppable Method — Founding Pre-order",
  productDescription:
    "Founding member seat in the Droppable Method (Skool). Full access when the community opens.",
} as const;

export type PreorderPrice = {
  cents: number;
  /* true once the price has reached the full Skool price */
  full: boolean;
  /* next price and when it kicks in (null after the last step) */
  nextCents: number | null;
  nextAt: number | null;
};

/** Price in effect at `now` (ms since epoch). */
export function priceAt(now: number): PreorderPrice {
  const { schedule, startPriceCents, launchPriceCents } = PREORDER;
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
    full: cents >= launchPriceCents,
    nextCents: next?.cents ?? null,
    nextAt: next?.from ?? null,
  };
}

/** Format an integer amount of cents as a EUR string, e.g. 700 → "€7". */
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  /* drop ".00" for whole euros, keep cents otherwise (e.g. €7, €14.50) */
  const body = Number.isInteger(euros) ? String(euros) : euros.toFixed(2);
  return `€${body}`;
}

/** Real discount % off the launch price, rounded (e.g. €14 off €57 → 75%). */
export function discountPercent(cents: number): number {
  return Math.round((1 - cents / PREORDER.launchPriceCents) * 100);
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

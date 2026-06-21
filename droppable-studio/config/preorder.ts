/**
 * Pre-order pricing — single source of truth for the Skool card, the pre-order
 * form, the Stripe Checkout route and the confirmation emails (so the number
 * never drifts between them). See the plan + CLAUDE.md (Academy funnel).
 *
 * The Skool community is still being built; this is a founding pre-order at
 * 50% off, paid up front via Stripe Checkout.
 */
export const PREORDER = {
  currency: "eur" as const,
  /* struck-through "launch" price */
  launchPriceCents: 5700,
  /* what they actually pay now (€7) */
  priceCents: 700,
  productName: "The Droppable Method — Founding Pre-order",
  productDescription:
    "Founding member seat in the Droppable Method (Skool). Pre-order at 50% off — full access when the community opens.",
} as const;

/** Format an integer amount of cents as a EUR string, e.g. 700 → "€7". */
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  /* drop ".00" for whole euros, keep cents otherwise (e.g. €7, €14.50) */
  const body = Number.isInteger(euros) ? String(euros) : euros.toFixed(2);
  return `€${body}`;
}

/** Real discount %, derived from the prices so it can never drift (e.g. €7
 *  off €57 → 88%). Rounded to the nearest whole percent. */
export const DISCOUNT_PERCENT = Math.round(
  (1 - PREORDER.priceCents / PREORDER.launchPriceCents) * 100
);

export const PREORDER_DISPLAY = {
  launch: formatPrice(PREORDER.launchPriceCents),
  now: formatPrice(PREORDER.priceCents),
  off: `${DISCOUNT_PERCENT}% off`,
} as const;

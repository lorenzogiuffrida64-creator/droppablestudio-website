import Stripe from "stripe";

/**
 * Shared server-side Stripe client. Lazily constructed so a missing key only
 * errors on the routes that actually use Stripe (not at import time during a
 * build that doesn't have the secret yet).
 *
 * Required env: STRIPE_SECRET_KEY (test key while building, live key at launch).
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key);
  return _stripe;
}

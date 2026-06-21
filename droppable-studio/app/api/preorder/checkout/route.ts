/**
 * Pre-order checkout — creates a Stripe Checkout Session for the founding
 * pre-order of the Droppable Method (Skool). The custom form
 * (components/PreorderForm.tsx) POSTs JSON here; we return { url } and the
 * client redirects to Stripe's hosted checkout.
 *
 * The buyer's email/name/phone are collected on the form and prefilled into the
 * session; Stripe also collects a phone number as a backstop. Confirmation +
 * studio notification emails are sent from the webhook on payment success
 * (app/api/stripe/webhook/route.ts).
 *
 * Required env (see .env.example): STRIPE_SECRET_KEY.
 * Optional: NEXT_PUBLIC_SITE_URL (otherwise the request origin is used).
 */
import { getStripe } from "@/lib/stripe";
import { PREORDER } from "@/config/preorder";

export const runtime = "nodejs";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  /* honeypot: bots fill the hidden field — accept silently, do nothing */
  if (typeof data._gotcha === "string" && data._gotcha.trim() !== "") {
    return Response.json({ url: null }, { status: 200 });
  }

  const get = (k: string) =>
    typeof data[k] === "string" ? (data[k] as string).trim() : "";

  const firstName = get("firstName");
  const lastName = get("lastName");
  const email = get("email");
  const phone = get("phone");

  if (!firstName || !lastName || !email) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!isEmail(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      phone_number_collection: { enabled: true },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: PREORDER.currency,
            unit_amount: PREORDER.priceCents,
            product_data: {
              name: PREORDER.productName,
              description: PREORDER.productDescription,
            },
          },
        },
      ],
      metadata: {
        firstName,
        lastName,
        phone,
        type: "skool_preorder",
      },
      success_url: `${origin}/preorder/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/preorder`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error", err);
    return Response.json({ error: "Checkout unavailable" }, { status: 502 });
  }
}

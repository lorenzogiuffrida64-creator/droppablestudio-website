/**
 * Stripe webhook — fires on a completed pre-order checkout. We verify the
 * signature against the raw request body, then on `checkout.session.completed`
 * send two emails via Resend (same approach as app/api/inquiry/route.ts):
 *   1. buyer confirmation ("you're in")
 *   2. studio notification (the new pre-order, with name/email/phone/amount)
 *
 * The authoritative pre-order list lives in the Stripe Dashboard
 * (Payments / Customers); these emails are the working notifications.
 *
 * Required env (see .env.example):
 *   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY
 *   PREORDER_TO   — studio recipients (comma-separated; can equal INQUIRY_TO)
 *   INQUIRY_FROM  — verified sender (reused)
 */
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { DISCOUNT_PERCENT } from "@/config/preorder";

export const runtime = "nodejs";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtAmount = (amount: number | null, currency: string | null) => {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: (currency || "eur").toUpperCase(),
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${(currency || "").toUpperCase()}`;
  }
};

async function sendEmail(opts: {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.INQUIRY_FROM || "Droppable Studio <onboarding@resend.dev>";
  if (!apiKey || opts.to.length === 0) {
    console.error("Pre-order email skipped: set RESEND_API_KEY and recipients");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: opts.to,
      reply_to: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    console.error("Resend send failed", res.status, await res.text());
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) {
    return Response.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = await stripe.webhooks.constructEventAsync(raw, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};

    const firstName = meta.firstName || "";
    const lastName = meta.lastName || "";
    const name = `${firstName} ${lastName}`.trim() || "there";
    const email =
      session.customer_details?.email || session.customer_email || "";
    const phone = session.customer_details?.phone || meta.phone || "—";
    const amount = fmtAmount(session.amount_total, session.currency);

    /* 1) studio notification */
    const studioTo = (process.env.PREORDER_TO || process.env.INQUIRY_TO || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const rows: [string, string][] = [
      ["Name", `${firstName} ${lastName}`.trim() || "—"],
      ["Email", email || "—"],
      ["Phone", phone],
      ["Amount", amount],
      ["Product", "The Droppable Method — Founding Pre-order"],
    ];

    await sendEmail({
      to: studioTo,
      replyTo: email || undefined,
      subject: "✅NEW DROPPABLE PRE-ORDER✅",
      text: [
        "Hi,",
        "",
        "A new founding pre-order just came in.",
        "",
        ...rows.map(([k, v]) => `${k}: ${v}`),
      ].join("\n"),
      html: `
        <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1B2C40">
          <p>Hi,</p>
          <p>A new <strong>founding pre-order</strong> just came in.</p>
          <table style="border-collapse:collapse">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:4px 14px 4px 0;vertical-align:top;white-space:nowrap"><strong>${esc(
                    k
                  )}</strong></td><td style="padding:4px 0;vertical-align:top">${esc(
                    v
                  )}</td></tr>`
              )
              .join("")}
          </table>
        </div>`,
    });

    /* 2) buyer confirmation */
    if (email) {
      await sendEmail({
        to: [email],
        subject: "You're in — your Droppable Method seat is reserved",
        text: [
          `Hi ${name},`,
          "",
          "Your founding pre-order is confirmed — thank you.",
          "",
          `Amount: ${amount}`,
          "",
          `You've locked the ${DISCOUNT_PERCENT}% founding rate. We'll email you the moment The Droppable Method opens, with your access details.`,
          "",
          "— Droppable Studio",
        ].join("\n"),
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1B2C40">
            <p>Hi ${esc(name)},</p>
            <p>Your <strong>founding pre-order is confirmed</strong> — thank you.</p>
            <p><strong>Amount:</strong> ${esc(amount)}</p>
            <p>You've locked the ${DISCOUNT_PERCENT}% founding rate. We'll email you the moment
            <em>The Droppable Method</em> opens, with your access details.</p>
            <p>— Droppable Studio</p>
          </div>`,
      });
    }
  }

  return Response.json({ received: true });
}

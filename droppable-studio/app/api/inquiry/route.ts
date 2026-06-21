/**
 * Inquiry notification endpoint.
 *
 * The custom form (components/InquiryForm.tsx) POSTs the submission here as
 * JSON; we email it via Resend (https://resend.com) — recreating the original
 * "✅NEW DROPPABLE STUDIO INQUIRE✅" notification, to any number of recipients.
 *
 * Required env vars (see .env.example):
 *   RESEND_API_KEY   — Resend API key
 *   INQUIRY_TO       — comma-separated recipient emails
 *   INQUIRY_FROM     — verified sender, e.g. "Droppable Studio <inquiries@yourdomain.com>"
 *                      (defaults to Resend's onboarding sender for quick testing)
 */

export const runtime = "nodejs";

/* email layout order — follows the new progressive form (InquiryForm.tsx):
   the brief reads as the climb, contact block first for quick reply */
const FIELD_ORDER = [
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Company (preferred)",
  "Industry",
  "What is your brand about?",
  "How much growth is in attention you're not capturing?",
  "Why did you choose to use AI for this project?",
  "What is your business size?",
  "What is your budget range for this project?",
  "Why Droppable?",
];

const REQUIRED = [
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Industry",
  "What is your brand about?",
  "How much growth is in attention you're not capturing?",
  "Why did you choose to use AI for this project?",
  "What is your business size?",
  "Why Droppable?",
];

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  /* honeypot: bots fill the hidden field — silently accept, send nothing */
  if (typeof data._gotcha === "string" && data._gotcha.trim() !== "") {
    return Response.json({ ok: true });
  }

  const get = (k: string) =>
    typeof data[k] === "string" ? (data[k] as string).trim() : "";

  for (const k of REQUIRED) {
    if (!get(k)) {
      return Response.json({ error: `Missing field: ${k}` }, { status: 400 });
    }
  }
  const email = get("Email");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.INQUIRY_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from =
    process.env.INQUIRY_FROM || "Droppable Studio <onboarding@resend.dev>";

  if (!apiKey || to.length === 0) {
    console.error("Inquiry email not configured: set RESEND_API_KEY and INQUIRY_TO");
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  const rows = FIELD_ORDER.map((k) => ({ k, v: get(k) || "—" }));

  const text = [
    "Hi,",
    "",
    "Your form Droppablestudio inquiries just received a new submission.",
    "",
    "Here are the details:",
    "",
    ...rows.map((r) => `${r.k}: ${r.v}`),
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1B2C40">
      <p>Hi,</p>
      <p>Your form <strong>Droppablestudio inquiries</strong> just received a new submission.</p>
      <p>Here are the details:</p>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            (r) =>
              `<tr><td style="padding:4px 14px 4px 0;vertical-align:top;white-space:nowrap"><strong>${esc(
                r.k
              )}</strong></td><td style="padding:4px 0;vertical-align:top">${esc(
                r.v
              )}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: "✅NEW DROPPABLE STUDIO INQUIRE✅",
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend send failed", res.status, detail);
      return Response.json({ error: "Email send failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend request error", err);
    return Response.json({ error: "Email send failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

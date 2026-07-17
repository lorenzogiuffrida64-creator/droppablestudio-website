/**
 * Hiring-application notification endpoint (/apply page).
 *
 * The form (components/ApplyForm.tsx) POSTs form-data here and we email it
 * via Resend to the same recipients as inquiries. Work samples arrive as
 * links (project link / Instagram) — no file uploads: Vercel caps a
 * function's request body at ~4.5 MB, too small for real reels.
 *
 * Reuses the inquiry env vars (see .env.example):
 *   RESEND_API_KEY · INQUIRY_TO · INQUIRY_FROM
 */

export const runtime = "nodejs";

const FIELD_ORDER = [
  "Full name",
  "Email",
  "WhatsApp",
  "AI creation",
  "Motion design",
  "Kinetic text animation",
  "Graphic design",
  "Visual taste & direction",
  "Editing",
  "Instagram",
  "Best project link",
  "About",
];

const REQUIRED = [
  "Full name",
  "Email",
  "WhatsApp",
  "Best project link",
  "About",
];

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form body" }, { status: 400 });
  }

  /* honeypot: bots fill the hidden field — silently accept, send nothing */
  const gotcha = form.get("_gotcha");
  if (typeof gotcha === "string" && gotcha.trim() !== "") {
    return Response.json({ ok: true });
  }

  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

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
    console.error(
      "Application email not configured: set RESEND_API_KEY and INQUIRY_TO"
    );
    return Response.json({ error: "Server not configured" }, { status: 500 });
  }

  const rows = FIELD_ORDER.map((k) => ({ k, v: get(k) || "—" }));

  const text = [
    "Hi,",
    "",
    "Your form Droppablestudio applications just received a new submission.",
    "",
    "Here are the details:",
    "",
    ...rows.map((r) => `${r.k}: ${r.v}`),
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1B2C40">
      <p>Hi,</p>
      <p>Your form <strong>Droppablestudio applications</strong> just received a new submission.</p>
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
        subject: "🎬NEW DROPPABLE STUDIO APPLICATION🎬",
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

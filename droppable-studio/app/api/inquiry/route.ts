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
 *
 * Optional:
 *   CALENDLY_TOKEN   — Calendly personal access token. When set and the visitor
 *                      booked a call in the form, the booking (time, invitee,
 *                      meeting link, answers) is folded into this same email.
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
  "Strategy call",
  "Industry",
  "What does your brand do, and who is it for?",
  "#1 result wanted from this campaign",
  "What changes in the business in 90 days if this works",
  "What they've already tried, and why it didn't work",
  "Urgency (1–10)",
  "Why AI, and why now?",
  "What they're prepared to invest",
  "When are you ready to start?",
  "Why Droppable specifically?",
];

const REQUIRED = [
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Company (preferred)",
  "Industry",
  "What does your brand do, and who is it for?",
  "#1 result wanted from this campaign",
  "What changes in the business in 90 days if this works",
  "What they've already tried, and why it didn't work",
  "Urgency (1–10)",
  "Why AI, and why now?",
  "What they're prepared to invest",
  "When are you ready to start?",
  "Why Droppable specifically?",
];

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* ---------- Calendly booking → email rows ----------
   The form sends the event + invitee API URIs from Calendly's
   "calendly.event_scheduled" message; we resolve them with the API so the
   booking lands inside the inquiry email instead of a separate one. Only
   api.calendly.com URIs are fetched (the values come from the browser). */
const CALENDLY_API = "https://api.calendly.com/";

async function calendlyGet(uri: string, token: string) {
  if (!uri.startsWith(CALENDLY_API)) return null;
  const res = await fetch(uri, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Calendly fetch failed", res.status, uri);
    return null;
  }
  return (await res.json())?.resource ?? null;
}

async function calendlyRows(
  eventUri: string,
  inviteeUri: string
): Promise<{ k: string; v: string }[]> {
  const token = process.env.CALENDLY_TOKEN;
  if (!token || !eventUri) return [];
  try {
    const [event, invitee] = await Promise.all([
      calendlyGet(eventUri, token),
      inviteeUri ? calendlyGet(inviteeUri, token) : null,
    ]);
    if (!event) return [];

    const tz: string = invitee?.timezone || "Europe/Rome";
    const fmt = (iso: string, zone: string) =>
      new Date(iso).toLocaleString("en-GB", {
        timeZone: zone,
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

    const rows: { k: string; v: string }[] = [
      { k: "Call", v: event.name ?? "Strategy call" },
      { k: "Call time (studio)", v: fmt(event.start_time, "Europe/Rome") },
    ];
    if (tz !== "Europe/Rome") {
      rows.push({ k: "Call time (lead)", v: fmt(event.start_time, tz) });
    }
    const loc = event.location;
    const where = loc?.join_url || loc?.location || loc?.type;
    if (where) rows.push({ k: "Call location", v: String(where) });
    if (invitee?.email) {
      rows.push({
        k: "Booked by",
        v: `${invitee.name ?? ""} <${invitee.email}>`.trim(),
      });
    }
    for (const qa of invitee?.questions_and_answers ?? []) {
      if (qa?.answer) rows.push({ k: String(qa.question), v: String(qa.answer) });
    }
    if (invitee?.reschedule_url) {
      rows.push({ k: "Reschedule", v: invitee.reschedule_url });
    }
    if (invitee?.cancel_url) rows.push({ k: "Cancel", v: invitee.cancel_url });
    return rows;
  } catch (err) {
    console.error("Calendly lookup error", err);
    return [];
  }
}

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

  /* booking details sit right under the "Strategy call" line */
  const callRows = await calendlyRows(
    get("_calendlyEvent"),
    get("_calendlyInvitee")
  );
  if (callRows.length) {
    const at = rows.findIndex((r) => r.k === "Strategy call") + 1;
    rows.splice(at, 0, ...callRows);
  }

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

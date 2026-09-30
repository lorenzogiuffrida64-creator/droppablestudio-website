/**
 * Landing-page analytics events (SOP §8). No analytics tool is installed yet,
 * so events go to `window.dataLayer` — the queue GA4 / GTM read — and do
 * nothing else until a tool is approved and added. In development they are
 * also logged to the console.
 */
type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  (window.dataLayer ||= []).push({ event, ...payload });
  if (process.env.NODE_ENV !== "production") console.info("[track]", event, payload);
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** UTMs from the current URL (stories link with ?utm_source=ig_story&utm_content=dayN). */
export function readUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) out[k] = v.slice(0, 100);
  }
  return out;
}

export { UTM_KEYS };

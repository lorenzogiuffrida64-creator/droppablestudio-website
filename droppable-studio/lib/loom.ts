/**
 * Loom link check shared by the /apply form and /api/apply.
 * Accepts loom.com/share/<id> and loom.com/embed/<id> (with or without
 * https:// or www., query string allowed). Returns the normalised https URL,
 * or null when it isn't a Loom video link.
 */
export function normalizeLoomUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase();
  if (host !== "loom.com" && host !== "www.loom.com") return null;
  if (!/^\/(share|embed)\/[A-Za-z0-9-]{6,}\/?$/.test(url.pathname)) return null;
  url.protocol = "https:";
  return url.toString();
}

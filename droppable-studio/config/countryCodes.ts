/* Phone dialing codes — single source of truth, used by the shared
   <CountryCodeField> (components/CountryCodeField.tsx) inside both
   PreorderForm and InquiryForm.

   The prefix is a free-type field (no dropdown): the user types their dialing
   code and the matching flag appears live. This means NO client is ever
   blocked — even a micro-territory whose flag we don't list can still type
   their code and check out. The list below powers the flag recognition.

   `iso` is the ISO 3166-1 alpha-2 code, used to derive the flag emoji. Codes
   are unique; entries like +1 (US/Canada) and +7 (Russia/Kazakhstan) cover
   every country that shares that dialing code. */
export type CountryCode = { code: string; iso: string; n: string };

export const COUNTRY_CODES: CountryCode[] = [
  // — priority markets —
  { code: "+39", iso: "IT", n: "Italy" },
  { code: "+1", iso: "US", n: "United States / Canada" },
  { code: "+44", iso: "GB", n: "United Kingdom" },
  { code: "+33", iso: "FR", n: "France" },
  { code: "+49", iso: "DE", n: "Germany" },
  { code: "+34", iso: "ES", n: "Spain" },
  { code: "+41", iso: "CH", n: "Switzerland" },
  { code: "+31", iso: "NL", n: "Netherlands" },
  { code: "+351", iso: "PT", n: "Portugal" },
  { code: "+32", iso: "BE", n: "Belgium" },
  { code: "+43", iso: "AT", n: "Austria" },
  { code: "+353", iso: "IE", n: "Ireland" },
  { code: "+45", iso: "DK", n: "Denmark" },
  { code: "+46", iso: "SE", n: "Sweden" },
  { code: "+47", iso: "NO", n: "Norway" },
  { code: "+971", iso: "AE", n: "United Arab Emirates" },
  { code: "+966", iso: "SA", n: "Saudi Arabia" },
  { code: "+974", iso: "QA", n: "Qatar" },
  { code: "+65", iso: "SG", n: "Singapore" },
  { code: "+852", iso: "HK", n: "Hong Kong" },
  { code: "+61", iso: "AU", n: "Australia" },
  { code: "+81", iso: "JP", n: "Japan" },
  { code: "+82", iso: "KR", n: "South Korea" },
  { code: "+91", iso: "IN", n: "India" },
  { code: "+55", iso: "BR", n: "Brazil" },
  { code: "+52", iso: "MX", n: "Mexico" },
  { code: "+90", iso: "TR", n: "Turkey" },
  { code: "+27", iso: "ZA", n: "South Africa" },

  // — rest of Europe —
  { code: "+30", iso: "GR", n: "Greece" },
  { code: "+36", iso: "HU", n: "Hungary" },
  { code: "+40", iso: "RO", n: "Romania" },
  { code: "+48", iso: "PL", n: "Poland" },
  { code: "+420", iso: "CZ", n: "Czechia" },
  { code: "+421", iso: "SK", n: "Slovakia" },
  { code: "+359", iso: "BG", n: "Bulgaria" },
  { code: "+385", iso: "HR", n: "Croatia" },
  { code: "+386", iso: "SI", n: "Slovenia" },
  { code: "+381", iso: "RS", n: "Serbia" },
  { code: "+382", iso: "ME", n: "Montenegro" },
  { code: "+383", iso: "XK", n: "Kosovo" },
  { code: "+387", iso: "BA", n: "Bosnia and Herzegovina" },
  { code: "+389", iso: "MK", n: "North Macedonia" },
  { code: "+355", iso: "AL", n: "Albania" },
  { code: "+358", iso: "FI", n: "Finland" },
  { code: "+354", iso: "IS", n: "Iceland" },
  { code: "+372", iso: "EE", n: "Estonia" },
  { code: "+371", iso: "LV", n: "Latvia" },
  { code: "+370", iso: "LT", n: "Lithuania" },
  { code: "+352", iso: "LU", n: "Luxembourg" },
  { code: "+356", iso: "MT", n: "Malta" },
  { code: "+357", iso: "CY", n: "Cyprus" },
  { code: "+377", iso: "MC", n: "Monaco" },
  { code: "+378", iso: "SM", n: "San Marino" },
  { code: "+380", iso: "UA", n: "Ukraine" },
  { code: "+375", iso: "BY", n: "Belarus" },
  { code: "+373", iso: "MD", n: "Moldova" },
  { code: "+7", iso: "RU", n: "Russia / Kazakhstan" },
  { code: "+995", iso: "GE", n: "Georgia" },
  { code: "+374", iso: "AM", n: "Armenia" },
  { code: "+994", iso: "AZ", n: "Azerbaijan" },

  // — Middle East & South / Central Asia —
  { code: "+972", iso: "IL", n: "Israel" },
  { code: "+962", iso: "JO", n: "Jordan" },
  { code: "+961", iso: "LB", n: "Lebanon" },
  { code: "+968", iso: "OM", n: "Oman" },
  { code: "+973", iso: "BH", n: "Bahrain" },
  { code: "+965", iso: "KW", n: "Kuwait" },
  { code: "+964", iso: "IQ", n: "Iraq" },
  { code: "+98", iso: "IR", n: "Iran" },
  { code: "+92", iso: "PK", n: "Pakistan" },
  { code: "+93", iso: "AF", n: "Afghanistan" },
  { code: "+880", iso: "BD", n: "Bangladesh" },
  { code: "+94", iso: "LK", n: "Sri Lanka" },
  { code: "+977", iso: "NP", n: "Nepal" },
  { code: "+960", iso: "MV", n: "Maldives" },

  // — East & Southeast Asia —
  { code: "+86", iso: "CN", n: "China" },
  { code: "+886", iso: "TW", n: "Taiwan" },
  { code: "+853", iso: "MO", n: "Macau" },
  { code: "+62", iso: "ID", n: "Indonesia" },
  { code: "+60", iso: "MY", n: "Malaysia" },
  { code: "+66", iso: "TH", n: "Thailand" },
  { code: "+84", iso: "VN", n: "Vietnam" },
  { code: "+63", iso: "PH", n: "Philippines" },
  { code: "+95", iso: "MM", n: "Myanmar" },
  { code: "+855", iso: "KH", n: "Cambodia" },
  { code: "+856", iso: "LA", n: "Laos" },
  { code: "+673", iso: "BN", n: "Brunei" },
  { code: "+976", iso: "MN", n: "Mongolia" },

  // — Oceania —
  { code: "+64", iso: "NZ", n: "New Zealand" },
  { code: "+679", iso: "FJ", n: "Fiji" },
  { code: "+675", iso: "PG", n: "Papua New Guinea" },

  // — Africa —
  { code: "+20", iso: "EG", n: "Egypt" },
  { code: "+212", iso: "MA", n: "Morocco" },
  { code: "+213", iso: "DZ", n: "Algeria" },
  { code: "+216", iso: "TN", n: "Tunisia" },
  { code: "+218", iso: "LY", n: "Libya" },
  { code: "+234", iso: "NG", n: "Nigeria" },
  { code: "+254", iso: "KE", n: "Kenya" },
  { code: "+233", iso: "GH", n: "Ghana" },
  { code: "+255", iso: "TZ", n: "Tanzania" },
  { code: "+256", iso: "UG", n: "Uganda" },
  { code: "+251", iso: "ET", n: "Ethiopia" },
  { code: "+260", iso: "ZM", n: "Zambia" },
  { code: "+263", iso: "ZW", n: "Zimbabwe" },
  { code: "+225", iso: "CI", n: "Côte d’Ivoire" },
  { code: "+221", iso: "SN", n: "Senegal" },
  { code: "+237", iso: "CM", n: "Cameroon" },
  { code: "+250", iso: "RW", n: "Rwanda" },
  { code: "+244", iso: "AO", n: "Angola" },
  { code: "+258", iso: "MZ", n: "Mozambique" },
  { code: "+267", iso: "BW", n: "Botswana" },
  { code: "+230", iso: "MU", n: "Mauritius" },

  // — Latin America —
  { code: "+54", iso: "AR", n: "Argentina" },
  { code: "+56", iso: "CL", n: "Chile" },
  { code: "+57", iso: "CO", n: "Colombia" },
  { code: "+51", iso: "PE", n: "Peru" },
  { code: "+58", iso: "VE", n: "Venezuela" },
  { code: "+593", iso: "EC", n: "Ecuador" },
  { code: "+591", iso: "BO", n: "Bolivia" },
  { code: "+595", iso: "PY", n: "Paraguay" },
  { code: "+598", iso: "UY", n: "Uruguay" },
  { code: "+507", iso: "PA", n: "Panama" },
  { code: "+506", iso: "CR", n: "Costa Rica" },
  { code: "+502", iso: "GT", n: "Guatemala" },
  { code: "+503", iso: "SV", n: "El Salvador" },
  { code: "+504", iso: "HN", n: "Honduras" },
  { code: "+505", iso: "NI", n: "Nicaragua" },
  { code: "+53", iso: "CU", n: "Cuba" },
  { code: "+509", iso: "HT", n: "Haiti" },
];

/* Turn an ISO 3166-1 alpha-2 code into its flag emoji (regional-indicator
   letters). Renders as a real flag on Apple/Android; on platforms without
   flag glyphs (e.g. Windows) it degrades to the two ISO letters — still
   informative, never broken. */
export function flagFromIso(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/[A-Z]/g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

/* Clean whatever the user types into a bare dialing code: keep digits, fold a
   leading international "00" into "+", force a single leading "+", and cap the
   length (no real country code exceeds 4 digits). Lets the user type freely
   while keeping the value tidy. */
export function normalizeDialCode(raw: string): string {
  const onlyDigits = raw.replace(/\D/g, "").replace(/^0{2}/, "");
  if (!onlyDigits) return raw.trim().startsWith("+") ? "+" : "";
  return "+" + onlyDigits.slice(0, 4);
}

/* Recognize the country for a typed code via longest-prefix match, so a flag
   appears the moment a valid code is entered (and survives extra digits if the
   whole number gets pasted). Returns the entry plus its flag, or null. */
export function lookupDialCode(raw: string): (CountryCode & { flag: string }) | null {
  const code = normalizeDialCode(raw);
  if (code.length < 2) return null; // just "+" or empty
  let best: CountryCode | null = null;
  for (const c of COUNTRY_CODES) {
    if (code.startsWith(c.code) && (!best || c.code.length > best.code.length)) {
      best = c;
    }
  }
  return best ? { ...best, flag: flagFromIso(best.iso) } : null;
}

/* A well-formed dialing code is "+" followed by 1–4 digits. Format-only, so it
   never blocks a real international client. */
export const isValidDialCode = (raw: string) => /^\+\d{1,4}$/.test(raw.trim());

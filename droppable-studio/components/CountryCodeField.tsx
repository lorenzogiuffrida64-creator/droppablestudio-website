"use client";

import { lookupDialCode, normalizeDialCode } from "@/config/countryCodes";

/* Free-type dialing-code field with a live flag — replaces the old country
   <select>. The user types their code (e.g. +39) and the matching flag appears
   instantly, so no one has to scroll a long menu to find a rare prefix. */
type Props = {
  value: string;
  onChange: (code: string) => void;
  id?: string;
  name?: string;
  invalid?: boolean;
  describedBy?: string;
};

export default function CountryCodeField({
  value,
  onChange,
  id = "phone-code",
  name = "phoneCode",
  invalid,
  describedBy,
}: Props) {
  const match = lookupDialCode(value);
  return (
    <div className={`phone-code${invalid ? " invalid" : ""}`}>
      <span className="phone-flag" aria-hidden="true">
        {match ? match.flag : "🌐"}
      </span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-country-code"
        placeholder="+39"
        value={value}
        aria-label={
          match
            ? `Country dialing code ${match.code} — ${match.n}`
            : "Country dialing code"
        }
        aria-required
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(normalizeDialCode(e.target.value))}
      />
    </div>
  );
}

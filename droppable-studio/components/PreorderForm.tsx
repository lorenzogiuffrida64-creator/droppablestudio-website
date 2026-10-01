"use client";

import { useState, type FormEvent } from "react";
import { priceAt, formatPrice } from "@/config/preorder";
import { useNow } from "@/components/PreorderClock";
import { track, readUtms } from "@/lib/track";
import { isValidDialCode } from "@/config/countryCodes";
import CountryCodeField from "@/components/CountryCodeField";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  _gotcha: string;
};
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "submitting" | "error";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export default function PreorderForm() {
  const [f, setF] = useState<Fields>({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+39",
    phone: "",
    _gotcha: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const now = useNow();
  const price = formatPrice(priceAt(now ?? 0).cents);

  const set = (k: keyof Fields, v: string) =>
    setF((s) => ({ ...s, [k]: v }));

  function validate(): Errors {
    const e: Errors = {};
    if (!f.firstName.trim()) e.firstName = "Required";
    if (!f.lastName.trim()) e.lastName = "Required";
    if (!f.email.trim()) e.email = "Required";
    else if (!isEmail(f.email.trim())) e.email = "Enter a valid email";
    if (!isValidDialCode(f.phoneCode)) e.phoneCode = "Add your country code";
    if (!f.phone.trim()) e.phone = "Required";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("submitting");
    const utms = readUtms();
    track("offer_cta_click", { price: priceAt(Date.now()).cents / 100 });
    try {
      const res = await fetch("/api/preorder/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: `${f.phoneCode} ${f.phone.trim()}`.trim(),
          _gotcha: f._gotcha,
          utms,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("No checkout URL");
      track("checkout_start", utms);
      /* hand off to Stripe's hosted checkout */
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form id="checkout-form" noValidate onSubmit={onSubmit}>
      {/* honeypot — bots fill it, dropped server-side */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={f._gotcha}
        onChange={(e) => set("_gotcha", e.target.value)}
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />

      <div className="inq-answer inq-contact">
        <div className={`field${errors.firstName ? " invalid" : ""}`}>
          <label htmlFor="firstName">
            First Name
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="firstName"
            name="firstName"
            value={f.firstName}
            placeholder="Jane"
            aria-required
            aria-invalid={errors.firstName ? true : undefined}
            onChange={(e) => set("firstName", e.target.value)}
          />
          {errors.firstName && (
            <span className="field-error">{errors.firstName}</span>
          )}
        </div>

        <div className={`field${errors.lastName ? " invalid" : ""}`}>
          <label htmlFor="lastName">
            Last Name
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="lastName"
            name="lastName"
            value={f.lastName}
            placeholder="Doe"
            aria-required
            aria-invalid={errors.lastName ? true : undefined}
            onChange={(e) => set("lastName", e.target.value)}
          />
          {errors.lastName && (
            <span className="field-error">{errors.lastName}</span>
          )}
        </div>

        <div className={`field full${errors.email ? " invalid" : ""}`}>
          <label htmlFor="email">
            Email
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={f.email}
            placeholder="jane@brand.com"
            aria-required
            aria-invalid={errors.email ? true : undefined}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        <div
          className={`field full${
            errors.phone || errors.phoneCode ? " invalid" : ""
          }`}
        >
          <label htmlFor="phone">
            Phone Number
            <span className="req" aria-hidden="true">
              *
            </span>
          </label>
          <div className="phone-row">
            <CountryCodeField
              value={f.phoneCode}
              onChange={(c) => set("phoneCode", c)}
              invalid={!!errors.phoneCode}
              describedBy={errors.phoneCode ? "phonecode-err" : undefined}
            />
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="328 827 3008"
              value={f.phone}
              aria-required
              aria-invalid={errors.phone ? true : undefined}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          {errors.phoneCode && (
            <span className="field-error" id="phonecode-err">
              {errors.phoneCode}
            </span>
          )}
          {errors.phone && (
            <span className="field-error">{errors.phone}</span>
          )}
        </div>
      </div>

      <div className="inq-nav">
        <span />
        <button
          className="btn"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            "Redirecting…"
          ) : (
            <>
              Pre-order for {price}{" "}
              <span className="arr">→</span>
            </>
          )}
        </button>
      </div>

      <div className="inq-foot">
        {status === "error" && (
          <p className="inq-error" role="alert">
            Something went wrong starting checkout. Please try again in a
            moment.
          </p>
        )}
      </div>
    </form>
  );
}

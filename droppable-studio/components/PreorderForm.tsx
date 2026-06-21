"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { PREORDER_DISPLAY } from "@/config/preorder";

/* dialing codes — mirrors components/InquiryForm.tsx (Italy first). Code-only
   labels keep the narrow selector clean. */
const COUNTRY_CODES = [
  { code: "+39", n: "Italy" },
  { code: "+1", n: "United States / Canada" },
  { code: "+44", n: "United Kingdom" },
  { code: "+33", n: "France" },
  { code: "+49", n: "Germany" },
  { code: "+34", n: "Spain" },
  { code: "+41", n: "Switzerland" },
  { code: "+31", n: "Netherlands" },
  { code: "+351", n: "Portugal" },
  { code: "+32", n: "Belgium" },
  { code: "+43", n: "Austria" },
  { code: "+353", n: "Ireland" },
  { code: "+45", n: "Denmark" },
  { code: "+46", n: "Sweden" },
  { code: "+47", n: "Norway" },
  { code: "+971", n: "United Arab Emirates" },
  { code: "+966", n: "Saudi Arabia" },
  { code: "+974", n: "Qatar" },
  { code: "+65", n: "Singapore" },
  { code: "+852", n: "Hong Kong" },
  { code: "+61", n: "Australia" },
  { code: "+81", n: "Japan" },
  { code: "+82", n: "South Korea" },
  { code: "+91", n: "India" },
  { code: "+55", n: "Brazil" },
  { code: "+52", n: "Mexico" },
  { code: "+90", n: "Turkey" },
  { code: "+27", n: "South Africa" },
];

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

  const firstRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const set = (k: keyof Fields, v: string) =>
    setF((s) => ({ ...s, [k]: v }));

  function validate(): Errors {
    const e: Errors = {};
    if (!f.firstName.trim()) e.firstName = "Required";
    if (!f.lastName.trim()) e.lastName = "Required";
    if (!f.email.trim()) e.email = "Required";
    else if (!isEmail(f.email.trim())) e.email = "Enter a valid email";
    if (!f.phone.trim()) e.phone = "Required";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("submitting");
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
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("No checkout URL");
      /* hand off to Stripe's hosted checkout */
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section className="inquiry">
      <div className="wrap">
        <div className="inq-col">
          <p className="eyebrow">04 / The Academy — Founding pre-order</p>
          <h1 className="inq-q">
            Lock your <em>founding seat.</em>
          </h1>
          <p className="preorder-lede">
            The Droppable Method opens soon. Pre-order now at {PREORDER_DISPLAY.off}{" "}
            and get full access the day it launches.
          </p>

          <p className="preorder-price preorder-price--lg">
            <span className="was">{PREORDER_DISPLAY.launch}</span>
            <span className="now">{PREORDER_DISPLAY.now}</span>
            <span className="off">{PREORDER_DISPLAY.off} · founding seat</span>
          </p>

          <form noValidate onSubmit={onSubmit}>
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
                  ref={firstRef}
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

              <div className={`field full${errors.phone ? " invalid" : ""}`}>
                <label htmlFor="phone">
                  Phone Number
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="phone-row">
                  <select
                    name="phoneCode"
                    value={f.phoneCode}
                    onChange={(e) => set("phoneCode", e.target.value)}
                    aria-label="Country dialing code"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.n} value={c.code} title={c.n}>
                        {c.code}
                      </option>
                    ))}
                  </select>
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
                    Pre-order for {PREORDER_DISPLAY.now}{" "}
                    <span className="arr">→</span>
                  </>
                )}
              </button>
            </div>

            <div className="inq-foot">
              <span className="inq-reassure">
                Secure checkout · Powered by Stripe
              </span>
              {status === "error" && (
                <p className="inq-error" role="alert">
                  Something went wrong starting checkout. Please try again in a
                  moment.
                </p>
              )}
            </div>
          </form>

          <p className="preorder-back">
            <Link href="/">
              <span className="arr" aria-hidden="true">
                ←
              </span>{" "}
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

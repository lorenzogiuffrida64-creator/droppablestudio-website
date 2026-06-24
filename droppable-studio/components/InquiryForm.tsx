"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";

/* dialing codes — common premium markets, Italy first (matches the studio).
   Code-only labels keep the narrow selector clean; the dialing code is all
   that's needed to compose the number. */
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

/* budget tiers — kept exactly as the original form */
const BUDGETS = ["400-1.5k$", "1.5k-5k$", "5k-20k$", "20k-50k$"];

/* ---------- the climax: one small question per screen ----------
   `name` == the exact label in the notification email, so the Resend
   notification (app/api/inquiry/route.ts) reproduces the brief in order.
   The sequence is a deliberate climb: frictionless entry → self-persuasion →
   future-pacing → qualification → the "why us" peak, contact asked late. */
type Step =
  | {
      kind: "choice";
      name: string;
      q: ReactNode;
      variant: "seg" | "chips";
      options: string[];
      required: boolean;
    }
  | {
      kind: "text";
      name: string;
      q: ReactNode;
      placeholder: string;
      multiline?: boolean;
      required: boolean;
    }
  | { kind: "contact"; q: ReactNode };

const STEPS: Step[] = [
  {
    kind: "choice",
    name: "Industry",
    q: (
      <>
        What are we putting in the <em>feed?</em>
      </>
    ),
    variant: "chips",
    options: [
      "Skincare",
      "Fashion",
      "Real Estate",
      "Music",
      "Hospitality",
      "Enterprise",
      "Other",
    ],
    required: true,
  },
  {
    kind: "text",
    name: "What is your brand about?",
    q: (
      <>
        What&apos;s the brand — and who&apos;s it <em>for?</em>
      </>
    ),
    placeholder: "A few words on what you make and who it's for",
    required: true,
  },
  {
    kind: "choice",
    name: "How much growth is in attention you're not capturing?",
    q: (
      <>
        How much of your growth is sitting in attention you{" "}
        <em>haven&apos;t captured yet?</em>
      </>
    ),
    variant: "seg",
    options: ["A little", "A fair amount", "A lot", "Most of it"],
    required: true,
  },
  {
    kind: "text",
    name: "Why did you choose to use AI for this project?",
    q: (
      <>
        Why AI, <em>why now</em> — what made you look this way?
      </>
    ),
    placeholder: "Your answer here…",
    required: true,
  },
  {
    kind: "choice",
    name: "What is your business size?",
    q: (
      <>
        Where&apos;s the brand <em>right now?</em>
      </>
    ),
    variant: "seg",
    options: ["Low", "Medium", "High"],
    required: true,
  },
  {
    kind: "choice",
    name: "What is your budget range for this project?",
    q: (
      <>
        To scope the right concept, what <em>range</em> are we working in?
      </>
    ),
    variant: "chips",
    options: BUDGETS,
    required: false,
  },
  {
    kind: "contact",
    q: (
      <>
        Who&apos;s the studio <em>replying to?</em>
      </>
    ),
  },
  {
    kind: "text",
    name: "Why Droppable?",
    q: (
      <>
        Last one that matters — why <em>Droppable?</em> What made you stop
        scrolling on us?
      </>
    ),
    placeholder: "Be honest — what pulled you in?",
    multiline: true,
    required: true,
  },
];

const CONTACT_REQUIRED = ["First Name", "Last Name", "Email", "Phone Number"];

type Answers = Record<string, string>;
type Errors = Record<string, string>;
type Status = "idle" | "submitting" | "done" | "error";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export default function InquiryForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ "Phone Code": "+39" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const total = STEPS.length;
  const current = STEPS[step];
  const isLast = step === total - 1;

  /* a "choice" whose selected option is "Other" reveals a free-text field so
     the visitor can name what "Other" is (only the Industry step has it today) */
  const showOther =
    current.kind === "choice" && answers[current.name] === "Other";

  const stepRef = useRef<HTMLDivElement>(null);

  /* move focus into each new screen so keyboard + screen-reader users land
     on the first control; the aria-live counter announces the new step */
  useEffect(() => {
    const el = stepRef.current?.querySelector<HTMLElement>(
      "input:not([type=radio]), textarea, [data-step-focus]"
    );
    el?.focus();
  }, [step]);

  /* when "Other" is picked, drop focus straight into the specify field */
  useEffect(() => {
    if (showOther) {
      stepRef.current
        ?.querySelector<HTMLInputElement>(".inq-other input")
        ?.focus();
    }
  }, [showOther]);

  const set = (name: string, value: string) =>
    setAnswers((a) => ({ ...a, [name]: value }));

  function validateStep(i: number): Errors {
    const s = STEPS[i];
    const e: Errors = {};
    if (s.kind === "contact") {
      for (const k of CONTACT_REQUIRED) {
        if (!(answers[k] ?? "").trim()) e[k] = "Required";
      }
      const email = (answers["Email"] ?? "").trim();
      if (email && !isEmail(email)) e["Email"] = "Enter a valid email";
    } else if (s.kind === "choice") {
      if (s.required && !(answers[s.name] ?? "").trim()) e[s.name] = "Required";
      if (
        answers[s.name] === "Other" &&
        !(answers[`${s.name} — other`] ?? "").trim()
      ) {
        e[`${s.name} — other`] = "Please specify";
      }
    } else if (s.required) {
      if (!(answers[s.name] ?? "").trim()) e[s.name] = "Required";
    }
    return e;
  }

  function goNext() {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (isLast) void submit();
    else setStep((s) => s + 1);
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function onFormSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    goNext();
  }

  async function submit() {
    setStatus("submitting");

    /* fold the country code into the single "Phone Number" value so the
       notification reads "Phone Number: +39 328 827 3008" */
    const payload: Answers = { ...answers };

    /* fold any "Other" free-text into its choice value, then drop the helper
       key — so the notification reads e.g. "Industry: Other — Pet care" */
    for (const k of Object.keys(payload)) {
      if (!k.endsWith(" — other")) continue;
      const base = k.slice(0, -" — other".length);
      const detail = (payload[k] ?? "").toString().trim();
      if (payload[base] === "Other" && detail) {
        payload[base] = `Other — ${detail}`;
      }
      delete payload[k];
    }

    const code = (payload["Phone Code"] ?? "").toString();
    const number = (payload["Phone Number"] ?? "").toString().trim();
    payload["Phone Number"] = `${code} ${number}`.trim();
    delete payload["Phone Code"];

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section className="inquiry">
        <div className="wrap">
          <div className="inq-done">
            <img
              className="inq-king"
              src="/logo-blue.png"
              alt=""
              aria-hidden="true"
            />
            <p className="eyebrow">Submitted</p>
            <h2>
              We&apos;ll be <em>in touch.</em>
            </h2>
            <p>
              Thank you — your inquiry just landed with the studio. We review
              every brief personally and reply within 1–2 business days.
            </p>
            <Link className="btn" href="/">
              Back to site
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="inquiry">
      <div className="wrap">
        <div className="inq-col">
          {/* progress */}
          <div className="inq-progress">
            <div className="inq-progress-bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${(step + 1) / total})` }} />
            </div>
            <p className="inq-count" aria-live="polite">
              {step + 1} <span>/ {total}</span>
            </p>
          </div>

          <form noValidate onSubmit={onFormSubmit}>
            {/* honeypot — hidden from humans; bots that fill it are dropped server-side */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={answers["_gotcha"] ?? ""}
              onChange={(e) => set("_gotcha", e.target.value)}
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
              }}
            />

            <div className="inq-step" key={step} ref={stepRef}>
              <h1 className="inq-q">{current.q}</h1>

              {current.kind === "text" && (
                <div className="inq-answer">
                  <TextControl
                    name={current.name}
                    value={answers[current.name] ?? ""}
                    onChange={(v) => set(current.name, v)}
                    placeholder={current.placeholder}
                    multiline={current.multiline}
                    required={current.required}
                    error={errors[current.name]}
                  />
                </div>
              )}

              {current.kind === "choice" && (
                <div className="inq-answer">
                  <div
                    className={`${current.variant === "seg" ? "seg" : "chips"}${
                      errors[current.name] ? " invalid" : ""
                    }`}
                    role="radiogroup"
                    aria-label="Choose one"
                  >
                    {current.options.map((opt) =>
                      current.variant === "seg" ? (
                        <label key={opt}>
                          <input
                            type="radio"
                            name={current.name}
                            value={opt}
                            checked={answers[current.name] === opt}
                            onChange={() => set(current.name, opt)}                          />
                          <span>{opt}</span>
                        </label>
                      ) : (
                        <label key={opt} className="chip">
                          <input
                            type="radio"
                            name={current.name}
                            value={opt}
                            checked={answers[current.name] === opt}
                            onChange={() => set(current.name, opt)}                          />
                          <span>{opt}</span>
                        </label>
                      )
                    )}
                  </div>
                  {errors[current.name] && (
                    <span className="field-error">{errors[current.name]}</span>
                  )}
                  {answers[current.name] === "Other" && (
                    <div className="inq-other">
                      <TextControl
                        name={`${current.name} — other`}
                        value={answers[`${current.name} — other`] ?? ""}
                        onChange={(v) => set(`${current.name} — other`, v)}
                        placeholder="Tell us your industry"
                        required
                        error={errors[`${current.name} — other`]}
                      />
                    </div>
                  )}
                </div>
              )}

              {current.kind === "contact" && (
                <div className="inq-answer inq-contact">
                  <TextControl
                    label="First Name"
                    name="First Name"
                    value={answers["First Name"] ?? ""}
                    onChange={(v) => set("First Name", v)}
                    placeholder="Jane"
                    required
                    error={errors["First Name"]}
                  />
                  <TextControl
                    label="Last Name"
                    name="Last Name"
                    value={answers["Last Name"] ?? ""}
                    onChange={(v) => set("Last Name", v)}
                    placeholder="Doe"
                    required
                    error={errors["Last Name"]}
                  />
                  <TextControl
                    label="Email"
                    name="Email"
                    type="email"
                    value={answers["Email"] ?? ""}
                    onChange={(v) => set("Email", v)}
                    placeholder="jane@brand.com"
                    required
                    full
                    error={errors["Email"]}
                  />
                  <div
                    className={`field full${
                      errors["Phone Number"] ? " invalid" : ""
                    }`}
                  >
                    <label htmlFor="phone-number">
                      Phone Number
                      <span className="req" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <div className="phone-row">
                      <select
                        name="Phone Code"
                        value={answers["Phone Code"] ?? "+39"}
                        onChange={(e) => set("Phone Code", e.target.value)}
                        aria-label="Country dialing code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.n} value={c.code} title={c.n}>
                            {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        id="phone-number"
                        name="Phone Number"
                        type="tel"
                        inputMode="tel"
                        placeholder="328 827 3008"
                        value={answers["Phone Number"] ?? ""}
                        onChange={(e) => set("Phone Number", e.target.value)}
                        aria-required
                        aria-invalid={errors["Phone Number"] ? true : undefined}
                        aria-describedby={
                          errors["Phone Number"]
                            ? "phone-number-err"
                            : undefined
                        }
                      />
                    </div>
                    {errors["Phone Number"] && (
                      <span className="field-error" id="phone-number-err">
                        {errors["Phone Number"]}
                      </span>
                    )}
                  </div>
                  <TextControl
                    label="Company"
                    name="Company (preferred)"
                    value={answers["Company (preferred)"] ?? ""}
                    onChange={(v) => set("Company (preferred)", v)}
                    placeholder="Acme Inc"
                    full
                  />
                </div>
              )}
            </div>

            {/* navigation */}
            <div className="inq-nav">
              {step > 0 ? (
                <button type="button" className="inq-prev" onClick={goBack}>
                  <span className="arr" aria-hidden="true">
                    ←
                  </span>{" "}
                  Back
                </button>
              ) : (
                <span />
              )}

              <div className="inq-nav-right">
                {current.kind === "choice" && !current.required && (
                  <button
                    type="button"
                    className="inq-skip"
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Skip
                  </button>
                )}
                <button
                  className="btn"
                  type="submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    "Sending…"
                  ) : isLast ? (
                    <>
                      Send it to the studio <span className="arr">→</span>
                    </>
                  ) : (
                    <>
                      Next <span className="arr">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="inq-foot">
              <span className="inq-reassure">No retainers · NDA on request</span>
              {status === "error" && (
                <p className="inq-error" role="alert">
                  Something went wrong sending your inquiry. Please try again in
                  a moment.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

const idFor = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function TextControl({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  full,
  multiline,
  error,
}: {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  full?: boolean;
  multiline?: boolean;
  error?: string;
}) {
  const id = idFor(name);
  const errId = error ? `${id}-err` : undefined;
  const shared = {
    id,
    name,
    placeholder,
    value,
    "aria-required": required || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": errId,
  };
  return (
    <div
      className={`field${full ? " full" : ""}${error ? " invalid" : ""}${
        label ? "" : " field-bare"
      }`}
    >
      {label && (
        <label htmlFor={id}>
          {label}
          {required ? (
            <span className="req" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="opt">optional</span>
          )}
        </label>
      )}
      {multiline ? (
        <textarea
          {...shared}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          {...shared}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error && (
        <span className="field-error" id={errId}>
          {error}
        </span>
      )}
    </div>
  );
}

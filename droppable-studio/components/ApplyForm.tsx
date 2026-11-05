"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import CountryPicker from "@/components/CountryPicker";
import { isValidDialCode } from "@/config/countryCodes";
import { QUESTION_COUNT } from "@/config/hiring-questions";
import { normalizeLoomUrl } from "@/lib/loom";

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

const LOOM_ERROR = "Not a Loom link — use loom.com/share/… or loom.com/embed/…";
const loomError = (v: string) =>
  !v.trim() ? "Required" : normalizeLoomUrl(v) ? "" : LOOM_ERROR;

type Status = "idle" | "submitting" | "done" | "error";
type Errors = Record<string, string>;

export default function ApplyForm() {
  const [loom, setLoom] = useState("");
  const [loomTouched, setLoomTouched] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappCode, setWhatsappCode] = useState("+39");
  const [whatsapp, setWhatsapp] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  // the form sits at the bottom of a long page — bring the confirmation into view
  useEffect(() => {
    if (status === "done")
      document.getElementById("submit")?.scrollIntoView({ block: "start" });
  }, [status]);

  function validate(): Errors {
    const e: Errors = {};
    const le = loomError(loom);
    if (le) e["Loom video link"] = le;
    if (!fullName.trim()) e["Full name"] = "Required";
    if (!email.trim()) e["Email"] = "Required";
    else if (!isEmail(email.trim())) e["Email"] = "Enter a valid email";
    if (!isValidDialCode(whatsappCode)) e["WhatsApp code"] = "Choose your country";
    if (!whatsapp.trim()) e["WhatsApp"] = "Required";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setLoomTouched(true);
    if (Object.values(e).some(Boolean)) {
      // jump to the first problem so it can't be missed below the fold
      // (next frame — the error state has to render first)
      requestAnimationFrame(() =>
        document
          .querySelector<HTMLElement>("#submit [aria-invalid='true']")
          ?.focus()
      );
      return;
    }

    setStatus("submitting");
    const fd = new FormData();
    fd.append("Loom video link", normalizeLoomUrl(loom) ?? loom.trim());
    fd.append("Full name", fullName.trim());
    fd.append("Email", email.trim());
    // one line in the email: "WhatsApp: +39 333 123 4567"
    fd.append("WhatsApp", `${whatsappCode} ${whatsapp.trim()}`);
    fd.append("_gotcha", gotcha);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <section className="inquiry apply-form" id="submit">
        <div className="wrap">
          <div className="inq-done">
            <img
              className="inq-king"
              src="/logo-blue.png"
              alt=""
              aria-hidden="true"
            />
            <h2>
              Application <em>landed.</em>
            </h2>
            <p>
              We read every application ourselves. If your Loom moves us, you
              hear from us on WhatsApp within 72 hours.
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
    <section className="apply apply-form" id="submit" aria-labelledby="apply-title">
      <div className="wrap">
        <div className="apply-col">
          <div className="inq-intro">
            <h2 id="apply-title">
              Submit your <em>Loom.</em>
            </h2>
            <p>
              We read every application ourselves. If the work moves us, we
              ping you on WhatsApp within 72 hours.
            </p>
          </div>

          <form noValidate onSubmit={onSubmit}>
            {/* honeypot — hidden from humans; bots that fill it are dropped server-side */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={gotcha}
              onChange={(e) => setGotcha(e.target.value)}
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
              }}
            />

            <div className="apply-card">
              {/* ---------- the Loom ---------- */}
              <div className="apply-loom">
                <p className="apply-label">Your Loom video</p>
                <p className="apply-sub">
                  One video, all {QUESTION_COUNT} questions, in order. Paste the share link.
                </p>
                <Field
                  label="Loom video link"
                  id="apply-loom"
                  type="url"
                  inputMode="url"
                  value={loom}
                  onChange={(v) => {
                    setLoom(v);
                    // once shown, keep the error live so it clears as they fix it
                    if (loomTouched || errors["Loom video link"])
                      setErrors((er) => ({ ...er, "Loom video link": loomError(v) }));
                  }}
                  onBlur={() => {
                    if (!loom.trim()) return;
                    setLoomTouched(true);
                    setErrors((er) => ({ ...er, "Loom video link": loomError(loom) }));
                  }}
                  placeholder="https://www.loom.com/share/…"
                  hint="Must be a loom.com/share/… or loom.com/embed/… link."
                  required
                  error={errors["Loom video link"]}
                />
              </div>

              {/* ---------- contact ---------- */}
              <Field
                label="Full name"
                id="apply-name"
                value={fullName}
                onChange={setFullName}
                placeholder="Jane Doe"
                required
                error={errors["Full name"]}
              />
              <Field
                label="Email"
                id="apply-email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="janedoe@gmail.com"
                required
                error={errors["Email"]}
              />
              {/* country code (picked from a panel) + number */}
              <div
                className={`field${
                  errors["WhatsApp"] || errors["WhatsApp code"] ? " invalid" : ""
                }`}
              >
                <label htmlFor="apply-whatsapp">
                  WhatsApp
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="phone-row">
                  <CountryPicker
                    id="apply-whatsapp-code"
                    value={whatsappCode}
                    onChange={setWhatsappCode}
                    invalid={!!errors["WhatsApp code"]}
                    describedBy={
                      errors["WhatsApp code"] ? "apply-whatsapp-code-err" : undefined
                    }
                  />
                  <input
                    id="apply-whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="333 123 4567"
                    value={whatsapp}
                    aria-required
                    aria-invalid={errors["WhatsApp"] ? true : undefined}
                    aria-describedby={
                      errors["WhatsApp"] ? "apply-whatsapp-err" : undefined
                    }
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                {errors["WhatsApp code"] && (
                  <span className="field-error" id="apply-whatsapp-code-err">
                    {errors["WhatsApp code"]}
                  </span>
                )}
                {errors["WhatsApp"] && (
                  <span className="field-error" id="apply-whatsapp-err">
                    {errors["WhatsApp"]}
                  </span>
                )}
              </div>

              {/* ---------- submit ---------- */}
              <div className="apply-submit">
                <button
                  className="btn"
                  type="submit"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    "Sending…"
                  ) : (
                    <>
                      Submit application <span className="arr">→</span>
                    </>
                  )}
                </button>
                <p className="apply-footnote">
                  We reply on WhatsApp when your work moves us. No spam, no
                  list.
                </p>
                {status === "error" && (
                  <p className="inq-error" role="alert">
                    Something went wrong sending your application. Please try
                    again in a moment.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = "text",
  inputMode,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  hint,
  error,
}: {
  label: string;
  id: string;
  type?: string;
  inputMode?: "url" | "email" | "tel" | "text";
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}) {
  const errId = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={`field${error ? " invalid" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {hint && !error && (
        <span className="apply-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field-error" id={errId}>
          {error}
        </span>
      )}
    </div>
  );
}

"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";

/* ---------- skill sliders — 0 = never touched, 10 = you teach it ---------- */
const SKILLS: { key: string; tag?: string; desc?: string }[] = [
  {
    key: "AI creation",
    tag: "Show us",
    desc: "Prompting, agents, generative pipelines. If you rate yourself here, link visuals below.",
  },
  { key: "Motion design" },
  { key: "Kinetic text animation" },
  { key: "Graphic design" },
  { key: "Visual taste & direction" },
  { key: "Editing" },
];

const ABOUT_MAX = 500;

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

type Status = "idle" | "submitting" | "done" | "error";
type Errors = Record<string, string>;

export default function ApplyForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [skills, setSkills] = useState<Record<string, number>>(
    Object.fromEntries(SKILLS.map((s) => [s.key, 0]))
  );
  const [instagram, setInstagram] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [about, setAbout] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validate(): Errors {
    const e: Errors = {};
    if (!fullName.trim()) e["Full name"] = "Required";
    if (!email.trim()) e["Email"] = "Required";
    else if (!isEmail(email.trim())) e["Email"] = "Enter a valid email";
    if (!whatsapp.trim()) e["WhatsApp"] = "Required";
    if (!projectLink.trim()) e["Best project link"] = "Required";
    if (!about.trim()) e["About"] = "Required";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    setStatus("submitting");
    const fd = new FormData();
    fd.append("Full name", fullName.trim());
    fd.append("Email", email.trim());
    fd.append("WhatsApp", whatsapp.trim());
    for (const s of SKILLS) fd.append(s.key, `${skills[s.key]} / 10`);
    fd.append("Instagram", instagram.trim());
    fd.append("Best project link", projectLink.trim());
    fd.append("About", about.trim());
    fd.append("_gotcha", gotcha);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
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
            <p className="eyebrow">Sent</p>
            <h2>
              Application <em>landed.</em>
            </h2>
            <p>
              We read every application ourselves. If the work moves us, you
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
    <section className="apply">
      <div className="wrap">
        <div className="apply-col">
          <div className="inq-intro">
            <p className="eyebrow">Join the studio</p>
            <h1>
              Show us what you can <em>drop.</em>
            </h1>
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
              <Field
                label="WhatsApp"
                id="apply-whatsapp"
                type="tel"
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="+39 333 123 4567"
                required
                error={errors["WhatsApp"]}
              />

              <hr className="apply-hr" />

              {/* ---------- skills ---------- */}
              <div>
                <p className="apply-label">Your skills</p>
                <p className="apply-sub">
                  Rate yourself honestly. 0 = never touched. 10 = you teach it.
                </p>
                {SKILLS.map((s) => (
                  <div className="skill" key={s.key}>
                    <div className="skill-top">
                      <span className="skill-name">
                        {s.key}
                        {s.tag && <b className="skill-tag">{s.tag}</b>}
                      </span>
                      <span className="skill-score">
                        <b>{skills[s.key]}</b>/10
                      </span>
                    </div>
                    {s.desc && <p className="skill-desc">{s.desc}</p>}
                    <input
                      type="range"
                      className="skill-range"
                      min={0}
                      max={10}
                      step={1}
                      value={skills[s.key]}
                      aria-label={`${s.key} — rate yourself 0 to 10`}
                      style={
                        { "--fill": `${skills[s.key] * 10}%` } as CSSProperties
                      }
                      onChange={(e) =>
                        setSkills((sk) => ({
                          ...sk,
                          [s.key]: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              <hr className="apply-hr" />

              {/* ---------- show your work ---------- */}
              <div>
                <p className="apply-label">Show your work</p>
                <div className="apply-work">
                  <Field
                    label="Instagram"
                    id="apply-instagram"
                    value={instagram}
                    onChange={setInstagram}
                    placeholder="@yourhandle"
                    hint="Optional if you drop a project link below."
                  />
                  <Field
                    label="Best project link"
                    id="apply-link"
                    type="url"
                    value={projectLink}
                    onChange={setProjectLink}
                    placeholder="https://drive.google.com/… or vimeo.com/…"
                    hint="Drive, Vimeo, YouTube, WeTransfer, portfolio. Anything."
                    required
                    error={errors["Best project link"]}
                  />
                </div>
              </div>

              <hr className="apply-hr" />

              {/* ---------- about ---------- */}
              <div className={`field${errors["About"] ? " invalid" : ""}`}>
                <label htmlFor="apply-about">
                  A quick word about you
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <textarea
                  id="apply-about"
                  rows={4}
                  maxLength={ABOUT_MAX}
                  placeholder="What do you make? What tools? What excites you?"
                  value={about}
                  aria-required
                  aria-invalid={errors["About"] ? true : undefined}
                  aria-describedby={errors["About"] ? "apply-about-err" : undefined}
                  onChange={(e) => setAbout(e.target.value.slice(0, ABOUT_MAX))}
                />
                {errors["About"] && (
                  <span className="field-error" id="apply-about-err">
                    {errors["About"]}
                  </span>
                )}
                <span className="apply-count" aria-hidden="true">
                  {about.length} / {ABOUT_MAX}
                </span>
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
                      Send my application <span className="arr">→</span>
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
  value,
  onChange,
  placeholder,
  required,
  hint,
  error,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  error?: string;
}) {
  const errId = error ? `${id}-err` : undefined;
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
        placeholder={placeholder}
        value={value}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && !error && <span className="apply-hint">{hint}</span>}
      {error && (
        <span className="field-error" id={errId}>
          {error}
        </span>
      )}
    </div>
  );
}

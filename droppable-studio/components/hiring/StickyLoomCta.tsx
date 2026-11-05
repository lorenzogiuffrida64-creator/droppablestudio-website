"use client";

import { useEffect, useState } from "react";

/* Mobile-only "Submit your Loom" bar pinned to the bottom of /apply, so the
   CTA is always one tap away. It steps aside while the hero CTA or the form
   itself (#submit) is on screen. Hidden above 860px via CSS. */
export default function StickyLoomCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = [
      document.querySelector(".hq-hero-cta"),
      document.getElementById("submit"),
    ].filter((el): el is Element => Boolean(el));
    if (!targets.length) return;

    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) visible.set(e.target, e.isIntersecting);
      setShow(![...visible.values()].some(Boolean));
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`hq-sticky${show ? " is-on" : ""}`} inert={!show}>
      <a className="btn" href="#submit">
        Submit your Loom{" "}
        <span className="arr" aria-hidden="true">
          ↓
        </span>
      </a>
    </div>
  );
}

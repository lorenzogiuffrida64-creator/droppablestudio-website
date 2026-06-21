"use client";

import { useEffect } from "react";

/* Scroll-reveal for .rv elements — same IntersectionObserver as the
   original inline script. A MutationObserver re-attaches reveals to any
   .rv element added after mount (re-renders, HMR), so nothing can get
   stuck invisible. Renders nothing. */
export default function Reveals() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const observeAll = () =>
      document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    observeAll();

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== Node.ELEMENT_NODE) continue;
          const el = n as Element;
          if (el.classList.contains("rv") && !el.classList.contains("in"))
            io.observe(el);
          el.querySelectorAll?.(".rv:not(.in)").forEach((c) => io.observe(c));
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

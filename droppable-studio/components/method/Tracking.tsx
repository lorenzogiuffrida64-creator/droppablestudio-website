"use client";

import { useEffect } from "react";
import { track, readUtms } from "@/lib/track";
import type { FaqItem } from "@/config/method";

/* page_view with UTMs, once per load */
export function PageView() {
  useEffect(() => {
    track("page_view", { page: "preorder", ...readUtms() });
  }, []);
  return null;
}

/* 5.11 — native <details> accordion; opening one sends faq_open with its id */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-list">
      {items.map(({ id, q, a }) => (
        <details
          className="faq-item"
          key={id}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) track("faq_open", { id });
          }}
        >
          <summary>
            <span className="faq-q">{q}</span>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p className="faq-a">{a}</p>
        </details>
      ))}
    </div>
  );
}

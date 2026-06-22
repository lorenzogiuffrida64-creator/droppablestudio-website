"use client";

import { useEffect, useRef } from "react";
import { REELS_VERSION, type WorkItem } from "@/config/work";

type LightboxProps = {
  item: WorkItem;
  onClose: () => void;
};

/* Plays a reel at its native aspect ratio — 9:16 stands tall, 16:9 goes
   wide — capped to the viewport. Click outside, ✕ or Esc to close. */
export default function Lightbox({ item, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.brand} — ${item.category}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        Close ✕
      </button>
      <figure className="lightbox-body">
        <video src={`${item.video}?v=${REELS_VERSION}`} controls autoPlay playsInline />
        <figcaption>
          <small>{item.category}</small>
          {item.brand}
        </figcaption>
      </figure>
    </div>
  );
}

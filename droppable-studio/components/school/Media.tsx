"use client";

import { useEffect, useRef, useState } from "react";
import { REELS_VERSION, type WorkItem } from "@/config/work";
import type { ClassroomShot, TestimonialClip } from "@/config/method";
import { track } from "@/lib/track";
import { goToCheckout } from "@/components/method/Pricing";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 5.3 founder video ----------
   16:9, muted autoplay loop with a "Tap for sound" control: tapping unmutes and
   restarts from 0. The poster paints first; the file only loads after mount, so
   it never competes with the headline for LCP. */
export function FounderVideo({
  src,
  srcMobile,
  webm,
  poster,
  captions,
}: {
  src: string;
  srcMobile?: string;
  webm?: string;
  poster: string;
  captions?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);
  const sent = useRef(new Set<string>());
  const once = (e: string) => {
    if (sent.current.has(e)) return;
    sent.current.add(e);
    track(e);
  };

  useEffect(() => {
    if (!reducedMotion()) setLoad(true);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !load) return;
    v.load();
    v.play().catch(() => {});
  }, [load]);

  const unmute = () => {
    const v = ref.current;
    if (!v) return;
    if (!load) setLoad(true);
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setMuted(false);
    once("video_unmute");
  };

  /* milestones count from the unmuted watch — the one that means anything */
  const last = useRef(0);
  const onTime = () => {
    const v = ref.current;
    if (!v || muted || !v.duration) return;
    if (v.currentTime / v.duration >= 0.5) once("video_50");
    if (v.currentTime < last.current - 1) once("video_complete"); // looped back to 0
    last.current = v.currentTime;
  };

  return (
    <div className="m-video">
      <video
        ref={ref}
        muted={muted}
        loop
        playsInline
        /* once they've chosen to watch with sound, let them pause and scrub */
        controls={!muted}
        preload="none"
        poster={poster}
        onPlay={() => once("video_play")}
        onTimeUpdate={onTime}
      >
        {load && srcMobile && (
          <source src={srcMobile} type="video/mp4" media="(max-width: 640px)" />
        )}
        {load && webm && <source src={webm} type="video/webm" />}
        {load && <source src={src} type="video/mp4" />}
        {captions && <track kind="captions" src={captions} srcLang="en" label="English" />}
      </video>
      {muted && (
        <button type="button" className="m-sound" onClick={unmute}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />
          </svg>
          Tap for sound
        </button>
      )}
    </div>
  );
}

/* Until the founder video exists, the hero keeps an empty 16:9 frame so the
   layout is final and nothing shifts when the file lands. */
export function VideoFrame() {
  return (
    <div className="m-video m-video--empty" role="img" aria-label="Founder video coming soon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </div>
  );
}

/* ---------- 5.4 the proof reel ----------
   Swipeable strip of studio reels at their native ratio. Muted, loaded lazily,
   played only while on screen, and never more than two at once. */
export function ProofReel({ items }: { items: WorkItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || reducedMotion()) return;
    const vids = Array.from(rail.querySelectorAll("video"));
    const ratio = new Map<HTMLVideoElement, number>();

    const sync = () => {
      const top2 = [...ratio.entries()]
        .filter(([, r]) => r > 0.5)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([v]) => v);
      vids.forEach((v) => {
        if (top2.includes(v)) {
          if (!v.src) v.src = v.dataset.src!;
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          ratio.set(e.target as HTMLVideoElement, e.intersectionRatio)
        );
        sync();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <div className="m-reel" ref={railRef} tabIndex={0} aria-label="Studio reels — scroll sideways">
      {items.map((item) => (
        <div
          className="m-reel-item"
          key={item.video}
          style={{ ["--ar" as string]: item.aspect }}
        >
          <video
            muted
            loop
            playsInline
            preload="none"
            data-src={`${item.video}?v=${REELS_VERSION}`}
            poster={item.video?.replace("/reels/", "/posters/").replace(".mp4", ".jpg")}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------- 5.6 look inside the classroom ----------
   Real Skool screenshots, cropped to the lesson column so titles stay legible
   on a phone. Modules still being written are blurred and locked. A full-bleed scroll-snap rail: swipe / trackpad / arrow keys, or
   the prev-next buttons; counter + progress bar track the card in view. */
export function ClassroomCarousel({ shots }: { shots: ClassroomShot[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    const onScroll = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setProgress(max > 0 ? rail.scrollLeft / max : 0);
      /* the card whose left edge is nearest the rail's padding edge */
      const edge = rail.scrollLeft + parseFloat(getComputedStyle(rail).paddingLeft);
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - edge) < Math.abs(cards[best].offsetLeft - edge)) best = i;
      });
      setActive(rail.scrollLeft >= max - 2 ? cards.length - 1 : best);
    };
    onScroll();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[0] as HTMLElement | undefined;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || "0") : 300;
    rail.scrollBy({ left: dir * step, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const atEnd = progress >= 0.995;

  return (
    <div className="cls">
      <div className="cls-head">
        <h3>Look inside the classroom.</h3>
        <div className="cls-nav">
          <span className="cls-count tnum" aria-live="polite">
            {pad(active + 1)} <span>/ {pad(shots.length)}</span>
          </span>
          <button type="button" className="cls-btn" aria-label="Previous" onClick={() => go(-1)} disabled={progress <= 0.005}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" className="cls-btn" aria-label="Next" onClick={() => go(1)} disabled={atEnd}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div
        className="cls-rail"
        ref={railRef}
        tabIndex={0}
        role="region"
        aria-label="Classroom screenshots — scroll sideways"
      >
        {shots.map((s, i) => (
          <figure
            className={`cls-card${i === active ? " is-active" : ""}${s.locked ? " is-locked" : ""}`}
            key={s.src}
          >
            {s.locked ? (
              /* locked: blur is baked into the file; the whole card leads to checkout */
              <a
                className="cls-frame"
                href="#checkout"
                aria-label={`${s.title} is locked. ${s.teaser ? `${s.teaser} ` : ""}Pre-order to discover it.`}
                onClick={(e) => {
                  e.preventDefault();
                  track("locked_class_click", { title: s.title });
                  goToCheckout();
                }}
              >
                <img
                  src={s.src}
                  width={320}
                  height={774}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span className="cls-locked-body">
                  <span className="cls-locked-mid">
                    <span className="cls-lock-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
                        <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
                        <path d="M12 14.6v2.2" />
                      </svg>
                    </span>
                    {s.teaser && <span className="cls-hook">{s.teaser}</span>}
                  </span>
                  <span className="cls-unlock">Pre-order to discover</span>
                </span>
              </a>
            ) : (
              <div className="cls-frame">
                <img
                  src={s.src}
                  width={640}
                  height={1546}
                  alt={`${s.label}: ${s.title} — lesson list in the Skool classroom`}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </div>
            )}
            <figcaption>
              <span>{s.label}</span>
              <b>{s.title}</b>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="cls-progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
      </div>
    </div>
  );
}


/* ---------- testimonial clips ----------
   The same strip as the "This is the level." showcase (.m-reel): muted,
   loaded lazily, playing only on screen, max two at once. Tapping a clip turns
   its sound on and restarts it; every other clip goes back to muted. */
export function TestimonialReel({ clips }: { clips: TestimonialClip[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [voiced, setVoiced] = useState<number | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || reducedMotion()) return;
    const vids = Array.from(rail.querySelectorAll("video"));
    const ratio = new Map<HTMLVideoElement, number>();
    const sync = () => {
      const top2 = [...ratio.entries()]
        .filter(([, r]) => r > 0.5)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([v]) => v);
      vids.forEach((v) => {
        if (top2.includes(v)) {
          if (!v.src) v.src = v.dataset.src!;
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratio.set(e.target as HTMLVideoElement, e.intersectionRatio));
        sync();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  const voice = (i: number) => {
    const vids = Array.from(railRef.current?.querySelectorAll("video") ?? []);
    vids.forEach((v, j) => (v.muted = j !== i));
    const v = vids[i];
    if (!v) return;
    if (!v.src) v.src = v.dataset.src!;
    v.currentTime = 0;
    v.play().catch(() => {});
    setVoiced(i);
    track("testimonial_play", { name: clips[i].name });
  };

  return (
    <div className="m-reel m-reel--testi" ref={railRef} tabIndex={0} aria-label="Student call clips — scroll sideways">
      {clips.map((c, i) => (
        <div className="m-reel-item" key={c.src} style={{ ["--ar" as string]: c.aspect }}>
          <video
            muted={voiced !== i}
            loop
            playsInline
            preload="none"
            data-src={`${c.src}.mp4`}
            poster={`${c.src}.jpg`}
            controls={voiced === i}
          />
          {voiced !== i && (
            <button type="button" className="m-sound" onClick={() => voice(i)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4z" />
                <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />
              </svg>
              {c.name} · Tap for sound
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

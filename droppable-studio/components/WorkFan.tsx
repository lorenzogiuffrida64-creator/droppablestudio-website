"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { REELS_VERSION, type WorkItem } from "@/config/work";

/* The reel fan — cards pinned along a shallow arc, drifting right to left.

   The movement is lifted from the Osmo reference (DESIGN.md): "a horizontal fan
   of tilted product cards ... like polaroids pinned to a board", fanned between
   -5deg and +5deg. Here the fan is live rather than a static spread: one rAF
   reads the rail's scroll position and writes each card's tilt / lift / scale
   from where it sits relative to the viewport centre, so a card rises and
   straightens as it crosses the middle, then leans and drops away as it leaves.
   The arc IS the motion — nothing about it is baked into the markup.

   The loop mechanics stay the studio's own: the list renders twice back to back
   (the second copy aria-hidden) and the rail wraps by one list width at the
   halfway mark, so the drift never seams. Users can take over at any time —
   swipe / trackpad / the prev-next arrows — and the drift resumes a moment
   after they stop. Under prefers-reduced-motion the drift is off and the fan is
   shaped once, then only on the user's own scrolling.

   NOTE: for the wrap to stay seamless, one full list must be wider than the
   viewport — pass the items duplicated if the set is small. */

const TILT = 5; // deg of lean at the rail's edge — DESIGN.md fans -5deg..+5deg
const DROP = 46; // px an edge card falls below the crown of the arc
const SHRINK = 0.07; // how much an edge card gives up to the one at the centre
const REACH = 1; // clamp on p: a card reaches full lean at the rail's edge and
                 // holds it off-screen, so the fan never exceeds DESIGN.md's range
const DURATION = 40; // seconds per full list — matches the studio's other rails

export default function WorkFan({ items }: { items: WorkItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);
  const pausedUntilRef = useRef(0); // the drift is suspended while now < this

  /* Card geometry, cached: the per-frame pass writes transforms only, never
     reads layout, so the fan costs no reflow while it drifts. */
  const cardsRef = useRef<{ el: HTMLElement; mid: number }[]>([]);
  const dropRef = useRef(DROP); // scaled to the rail on small screens

  // Suspend the drift for `ms` whenever the user drives the rail themselves.
  const holdAuto = useCallback((ms: number) => {
    pausedUntilRef.current = performance.now() + ms;
  }, []);

  // Shape the fan from the rail's current scroll offset.
  const shape = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const reach = rail.clientWidth / 2;
    if (reach <= 0) return;
    const mid = rail.scrollLeft + reach;
    const drop = dropRef.current;
    for (const card of cardsRef.current) {
      const p = Math.max(-REACH, Math.min(REACH, (card.mid - mid) / reach));
      const lean = p * TILT;
      const lift = p * p * drop;
      const scale = 1 - p * p * SHRINK;
      card.el.style.transform = `translate3d(0,${lift.toFixed(2)}px,0) rotate(${lean.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      card.el.style.zIndex = String(60 - Math.round(Math.abs(p) * 50));
    }
  }, []);

  // Measure once, and again whenever the row can have changed width.
  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const track = rail.firstElementChild as HTMLElement | null;
    if (!track) return;
    // a phone's fan is shallower than a desktop's — the arc keeps its proportion
    dropRef.current = Math.min(DROP, rail.clientHeight * 0.14);
    const base = track.offsetLeft; // put offsets in the rail's scroll space
    cardsRef.current = Array.from(
      rail.querySelectorAll<HTMLElement>(".fan-card"),
    ).map((el) => ({ el, mid: el.offsetLeft - base + el.offsetWidth / 2 }));
    shape();
  }, [shape]);

  // Preview playback, reduced-motion flag, and the first measure.
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    railRef.current?.querySelectorAll("video").forEach((v) => {
      if (reduceRef.current) v.pause();
      else v.play().catch(() => {});
    });
    measure();
    // videos settle their box once metadata lands, so re-measure after that
    const rail = railRef.current;
    rail?.addEventListener("loadedmetadata", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      rail?.removeEventListener("loadedmetadata", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /* The drift. Under reduced motion there is no loop at all — the fan is shaped
     once above and then only when the user scrolls the rail themselves. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    if (reduceRef.current) {
      rail.addEventListener("scroll", shape, { passive: true });
      return () => rail.removeEventListener("scroll", shape);
    }

    let half = rail.scrollWidth / 2; // one full list = half the doubled track
    const remeasure = () => (half = rail.scrollWidth / 2);
    window.addEventListener("resize", remeasure);

    let raf = 0;
    let last = performance.now();
    let seen = -1; // skip the write when the rail hasn't actually moved
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (now >= pausedUntilRef.current && half > 0) {
        rail.scrollLeft += (half / DURATION) * dt;
        if (rail.scrollLeft >= half) rail.scrollLeft -= half; // seamless wrap
      }
      if (rail.scrollLeft !== seen) {
        seen = rail.scrollLeft;
        shape();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", remeasure);
    };
  }, [shape]);

  // Hand control to the user while they interact, then let the drift resume.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onWheel = () => holdAuto(1500);
    const onPointer = () => holdAuto(1500);
    const onTouch = () => holdAuto(2500); // let iOS momentum settle first
    rail.addEventListener("wheel", onWheel, { passive: true });
    rail.addEventListener("pointerdown", onPointer, { passive: true });
    rail.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      rail.removeEventListener("wheel", onWheel);
      rail.removeEventListener("pointerdown", onPointer);
      rail.removeEventListener("touchmove", onTouch);
    };
  }, [holdAuto]);

  /* Arrows step to the neighbouring card's edge — cards are variable-width, so
     there is no single step size. It's an infinite loop, so stepping back past
     the start jumps into the identical second copy. */
  const stepFan = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = cardsRef.current;
    if (!cards.length) return;
    holdAuto(1200);
    const first = cards[0];
    if (!reduceRef.current && dir < 0 && rail.scrollLeft < first.mid) {
      rail.scrollLeft += rail.scrollWidth / 2; // wrap so prev stays seamless
    }
    const x = rail.scrollLeft + rail.clientWidth / 2;
    const target =
      dir > 0
        ? cards.find((c) => c.mid > x + 1)
        : cards.reduceRight<(typeof cards)[number] | undefined>(
            (found, c) => found ?? (c.mid < x - 1 ? c : undefined),
            undefined,
          );
    if (!target) return;
    rail.scrollTo({
      left: target.mid - rail.clientWidth / 2,
      behavior: reduceRef.current ? "auto" : "smooth",
    });
  };

  const card = (item: WorkItem, key: string, hidden?: boolean) => (
    // --ar is the video's native w/h; the card is sized from it so the file
    // fills the frame exactly — no letterbox bars, no crop.
    <div
      key={key}
      className="fan-card"
      aria-hidden={hidden || undefined}
      style={{ "--ar": item.aspect } as CSSProperties}
    >
      {item.video ? (
        <video
          className="fan-media"
          src={`${item.video}?v=${REELS_VERSION}`}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      ) : (
        <span className={`fan-media ph ph-${item.ph}`} aria-hidden="true" />
      )}
      <span className="reel-live">
        <i aria-hidden="true" />
        Live
      </span>
    </div>
  );

  return (
    <div className="work-fan">
      <button
        type="button"
        className="work-arrow work-arrow--prev"
        aria-label="Previous reel"
        onClick={() => stepFan(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>

      <div className="fan-rail" ref={railRef}>
        <div className="fan-track">
          {items.map((item, i) => card(item, `a-${i}`))}
          {items.map((item, i) => card(item, `b-${i}`, true))}
        </div>
      </div>

      <button
        type="button"
        className="work-arrow work-arrow--next"
        aria-label="Next reel"
        onClick={() => stepFan(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import WorkTile from "@/components/WorkTile";
import { LINKS } from "@/config/links";
import { WORK } from "@/config/work";

/* Continuous right-to-left reel loop, JS-driven so it composes with manual
   controls. The list is rendered twice (the second copy aria-hidden) and the
   rail auto-scrolls; when it passes the halfway mark it wraps by one list width
   for a seamless loop. Users can take over at any time — finger swipe / trackpad
   scroll, or the prev/next arrows that nudge one reel — and the loop resumes a
   moment after they stop. Frozen under prefers-reduced-motion (plain scroll row,
   the duplicate copy hidden). */
export default function WorkGrid() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduceRef = useRef(false);
  const pausedUntilRef = useRef(0); // auto-scroll is suspended while now < this

  // Suspend the loop for `ms` whenever the user drives the rail themselves.
  const holdAuto = useCallback((ms: number) => {
    pausedUntilRef.current = performance.now() + ms;
  }, []);

  // Preview playback + reduced-motion flag.
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    railRef.current?.querySelectorAll("video").forEach((v) => {
      if (reduceRef.current) v.pause();
      else v.play().catch(() => {});
    });
  }, []);

  // The auto-scroll engine (skipped entirely under reduced motion).
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || reduceRef.current) return;

    let half = rail.scrollWidth / 2; // one full list = half the duplicated track
    const measure = () => (half = rail.scrollWidth / 2);
    window.addEventListener("resize", measure);

    const DURATION = 40; // seconds per full list — brisk enough to read as a live loop
                         // against the tiles' own playing-video motion (was 80, too subtle)
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (now >= pausedUntilRef.current && half > 0) {
        rail.scrollLeft += (half / DURATION) * dt;
        if (rail.scrollLeft >= half) rail.scrollLeft -= half; // seamless wrap
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Hand control to the user while they interact, then let the loop resume.
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

  // Arrows nudge exactly one reel and briefly pause the loop. It's an infinite
  // loop, so stepping back past the start jumps into the identical second copy.
  const scrollByReels = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const reels = rail.querySelectorAll<HTMLElement>(".reel");
    const step =
      reels.length > 1
        ? reels[1].offsetLeft - reels[0].offsetLeft
        : reels[0]?.offsetWidth ?? 0;
    holdAuto(1200);
    if (!reduceRef.current && dir < 0 && rail.scrollLeft < step) {
      rail.scrollLeft += rail.scrollWidth / 2; // wrap so prev is seamless
    }
    rail.scrollBy({ left: dir * step, behavior: reduceRef.current ? "auto" : "smooth" });
  };

  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="work-head">
          <div>
            <h2 className="rv d1">Selected campaigns</h2>
          </div>
          <p className="rv d2">
            One studio, every industry. Each reel is a fully AI-produced
            campaign — built to stop the scroll and move the numbers.
          </p>
        </div>
      </div>

      <div className="work-carousel">
        <button
          type="button"
          className="work-arrow work-arrow--prev"
          aria-label="Previous reel"
          onClick={() => scrollByReels(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="work-rail" ref={railRef}>
          <div className="work-track">
            {WORK.map((item, i) => (
              <WorkTile key={`a-${i}`} item={item} />
            ))}
            {WORK.map((item, i) => (
              <WorkTile key={`b-${i}`} item={item} hidden />
            ))}
          </div>
        </div>

        <button
          type="button"
          className="work-arrow work-arrow--next"
          aria-label="Next reel"
          onClick={() => scrollByReels(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="wrap">
        <p className="work-note rv">
          Full reels &amp; client results on{" "}
          <a href={LINKS.instagram} target="_blank" rel="noopener">
            @droppablestudio
          </a>
        </p>
      </div>
    </section>
  );
}

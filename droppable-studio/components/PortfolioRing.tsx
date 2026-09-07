"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { REELS_VERSION, type WorkItem } from "@/config/work";

/* ============================================================
   The portfolio wheel — every campaign, laid on one slow circle.

   Geometry: the wheel is a single point in the layout (.pf-wheel, 0×0) sitting
   low in the stage; each card is absolutely centred on that point and pushed
   out along the ring with `rotate(θ) translateY(-R)`, so it lands on the circle
   already tilted tangentially. The card box takes the reel's own native aspect
   (WorkItem.aspect), so every rectangle on the arc matches the shape of the
   video inside it — nothing is letterboxed or cropped. Only the top of the
   circle is in frame; the rest sweeps below the stage, which is
   `overflow:hidden`.

   Motion: one rAF writes ONE transform per frame, on .pf-ring. Nothing else
   moves, so the whole wheel is a single composited layer. Pointing at the ring
   band scales the wheel up and eases the spin down to a crawl; the card under
   the cursor pops out of the circle (pure CSS :hover) and opens in a lightbox.
   No labels anywhere — the reels speak for themselves.

   Cost control (this page exists so the main site stays smooth): no WebGL here,
   posters carry the first paint, the cards play small preview encodes rather
   than the masters, videos are preload="none", and only the handful nearest the
   top of the arc ever decode — everything else stays paused on its last frame.
   Playback starts a few reels at a time so decoding never spikes. Under
   prefers-reduced-motion the wheel is static and nothing plays.
   ============================================================ */

const SPIN_IDLE = 3.4; // deg/sec — a full turn in ~105s
const SPIN_HOT = 0.8; // deg/sec — near stop while the wheel is under the cursor
const SPIN_EASE = 2.4; // how fast the speed lerps between the two, per second

const VIS_MARGIN = 140; // px of slack around the viewport before a card is "off screen"
const SYNC_MS = 300; // playback bookkeeping interval
const STARTS_PER_SYNC = 4; // reels allowed to start per tick — staggers decoding
const MAX_PLAYING = 9; // concurrent decoders, desktop
const MAX_PLAYING_NARROW = 5; // …and on phones, where the budget is far smaller

/* WorkItem.aspect is the reel's native w/h. It has been both a number and a
   CSS ratio string ("16/9") in config/work.ts — accept either. */
const ratio = (aspect: number | string) => {
  if (typeof aspect === "number") return aspect || 16 / 9;
  const [w, h] = aspect.split("/").map(Number);
  return h ? w / h : Number(aspect) || 16 / 9;
};

/* The wheel plays 480px-wide preview encodes (/reels/wheel/) — the whole ring
   is ~3 MB instead of ~26 MB of 720p masters, and a card is never more than
   ~220px wide anyway. The lightbox loads the full-quality file. */
const previewFor = (video: string) => video.replace("/reels/", "/reels/wheel/");

/* poster frame for a reel: /reels/rolex.mp4 → /posters/rolex.jpg */
const posterFor = (video: string) =>
  `/posters/${video.split("/").pop()!.replace(/\.mp4$/, ".jpg")}`;

export default function PortfolioRing({
  items,
  children,
}: {
  items: WorkItem[];
  children?: ReactNode; // the copy that sits in the middle of the circle
}) {
  const stageRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null); // card to give focus back to

  const [hot, setHot] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const hotRef = useRef(false);
  const activeRef = useRef(false);
  const spinRef = useRef(0); // current ring rotation, degrees
  const onStageRef = useRef(true); // stage intersecting the viewport
  const reduceRef = useRef(false);

  // mirrors of the two state flags the rAF loop reads each frame
  useEffect(() => {
    hotRef.current = hot;
  }, [hot]);
  useEffect(() => {
    activeRef.current = active !== null;
  }, [active]);

  /* card slots: even angular spacing, box cut to the reel's own aspect.
     Equal area (w = √a, h = 1/√a) gives a wide 16:9 card and a squarer 4:3 one
     the same visual weight on the arc. */
  const slots = useMemo(
    () =>
      items.map((item, i) => {
        const a = ratio(item.aspect);
        const s = Math.sqrt(a);
        return { angle: (360 / items.length) * i, w: s, h: 1 / s };
      }),
    [items]
  );

  /* ---- the spin ---- */
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceRef.current) return; // static wheel, no loop at all

    let raf = 0;
    let last = performance.now();
    let speed = SPIN_IDLE;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // clamp after a tab switch
      last = now;
      if (onStageRef.current) {
        /* the lightbox blurs the whole stage — a wheel still turning under it
           costs a full-screen backdrop re-blur every frame, so it stops dead */
        const target = activeRef.current
          ? 0
          : hotRef.current
            ? SPIN_HOT
            : SPIN_IDLE;
        speed += (target - speed) * Math.min(1, SPIN_EASE * dt);
        spinRef.current = (spinRef.current + speed * dt) % 360;
        ring.style.transform = `rotate(${spinRef.current}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---- "the user goes on top of the element" ----
     Hit-tested against the ring band rather than the cards, so the wheel reacts
     as one object (and hovering the centre copy leaves it alone). Hysteresis
     keeps it from flickering on the boundary. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !window.matchMedia("(pointer: fine)").matches) return;

    let radius = 0;
    let queued = false;
    let px = 0;
    let py = 0;

    const measure = () => {
      const wheel = wheelRef.current;
      const card = ringRef.current?.querySelector<HTMLElement>(".pf-card");
      if (!wheel || !card) return null;
      const w = wheel.getBoundingClientRect(); // 0×0 box = the ring centre
      if (!hotRef.current || !radius) {
        const c = card.getBoundingClientRect();
        radius = Math.hypot(
          c.left + c.width / 2 - w.left,
          c.top + c.height / 2 - w.top
        );
      }
      return { x: w.left, y: w.top };
    };

    const evaluate = () => {
      queued = false;
      const centre = measure();
      if (!centre || !radius) return;
      const d = Math.hypot(px - centre.x, py - centre.y);
      const band = radius * (hotRef.current ? 0.58 : 0.44);
      setHot(Math.abs(d - radius) < band);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (queued) return; // one layout read per frame, no more
      queued = true;
      requestAnimationFrame(evaluate);
    };
    const onLeave = () => setHot(false);

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ---- playback: only what is actually on screen ---- */
  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;

    const io = new IntersectionObserver(
      ([entry]) => (onStageRef.current = entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(stage);

    let radius = 0;
    const sync = () => {
      const videos = ring.querySelectorAll<HTMLVideoElement>("video");
      const wheel = wheelRef.current?.getBoundingClientRect();
      if (!wheel) return;
      if (!radius) {
        const c = ring.querySelector<HTMLElement>(".pf-card")?.getBoundingClientRect();
        if (c) {
          radius = Math.hypot(
            c.left + c.width / 2 - wheel.left,
            c.top + c.height / 2 - wheel.top
          );
        }
      }
      const live =
        onStageRef.current &&
        !document.hidden &&
        !reduceRef.current &&
        !activeRef.current; // nothing behind the lightbox needs to keep playing
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      /* Rank what is on screen by how near it sits to the top of the arc and
         let only the most prominent few decode — browsers (Safari above all)
         choke well before thirteen videos at once. A card that drops out holds
         its last frame, so nothing flashes; it picks up again on its way round. */
      const wanted = new Set<number>();
      if (live) {
        const onScreen: { i: number; fromTop: number }[] = [];
        videos.forEach((_, i) => {
          // where this card is right now — trig, not a layout read
          const deg = (((slots[i].angle + spinRef.current) % 360) + 360) % 360;
          const a = (deg * Math.PI) / 180;
          const x = wheel.left + radius * Math.sin(a);
          const y = wheel.top - radius * Math.cos(a);
          if (
            x > -VIS_MARGIN &&
            x < vw + VIS_MARGIN &&
            y > -VIS_MARGIN &&
            y < vh + VIS_MARGIN
          ) {
            onScreen.push({ i, fromTop: Math.min(deg, 360 - deg) });
          }
        });
        onScreen.sort((a, b) => a.fromTop - b.fromTop);
        onScreen
          .slice(0, vw < 720 ? MAX_PLAYING_NARROW : MAX_PLAYING)
          .forEach((c) => wanted.add(c.i));
      }

      let starts = 0;
      videos.forEach((video, i) => {
        if (wanted.has(i)) {
          if (video.paused && starts < STARTS_PER_SYNC) {
            starts += 1;
            video.play().catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    };

    sync();
    const id = window.setInterval(sync, SYNC_MS);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [slots]);

  /* ---- lightbox ---- */
  const open = useCallback((i: number, el: HTMLElement) => {
    openerRef.current = el;
    setActive(i);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  const shown = active === null ? null : items[active];

  return (
    <>
      <section className="pf-stage" ref={stageRef} aria-label="Selected work">
        <div className={`pf-wheel${hot ? " is-hot" : ""}`} ref={wheelRef}>
          <div className="pf-ring" ref={ringRef}>
            {items.map((item, i) => (
              <button
                key={item.video ?? i}
                type="button"
                className="pf-card"
                style={
                  {
                    "--rot": `${slots[i].angle}deg`,
                    "--w": slots[i].w,
                    "--h": slots[i].h,
                  } as CSSProperties
                }
                aria-label={`Open the ${item.brand} reel`}
                onClick={(e) => open(i, e.currentTarget)}
              >
                <video
                  className="pf-media"
                  src={`${previewFor(item.video ?? "")}?v=${REELS_VERSION}`}
                  poster={posterFor(item.video ?? "")}
                  muted
                  loop
                  playsInline
                  preload="none"
                  tabIndex={-1}
                />
              </button>
            ))}
          </div>
        </div>

        {/* the copy that sits inside the circle */}
        <div className="pf-centre">{children}</div>
      </section>

      {/* sibling of the stage, so it covers the fixed header too */}
      {shown && (
        <div
          className="pf-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${shown.brand} reel`}
          onClick={close}
        >
          <button
            type="button"
            className="pf-lb-close"
            aria-label="Close reel"
            ref={closeRef}
            onClick={close}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="pf-lb-inner" onClick={(e) => e.stopPropagation()}>
            <div
              className="pf-lb-card"
              style={{ "--a": ratio(shown.aspect) } as CSSProperties}
            >
              <video
                className="pf-media"
                src={`${shown.video}?v=${REELS_VERSION}`}
                poster={posterFor(shown.video ?? "")}
                muted
                loop
                playsInline
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

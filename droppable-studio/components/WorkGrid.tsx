"use client";

import { useEffect, useRef, useState } from "react";
import WorkTile from "@/components/WorkTile";
import Lightbox from "@/components/Lightbox";
import { LINKS } from "@/config/links";
import { WORK, type WorkItem } from "@/config/work";

/* Continuous right-to-left reel loop. Same technique as the testimonials
   marquee: one track holding the list twice, slid by -50% (@keyframes slide),
   so the half-width wrap is seamless. Card spacing is baked into each card
   (margin) to keep that wrap clean. The second copy is aria-hidden so screen
   readers don't hear duplicates. Previews autoplay muted; clicking opens the
   full reel. Frozen under prefers-reduced-motion (rail becomes a scroll row). */
export default function WorkGrid() {
  const [open, setOpen] = useState<WorkItem | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vids = railRef.current?.querySelectorAll("video");
    if (!vids?.length) return;
    vids.forEach((v) => {
      if (reduce) v.pause();
      else v.play().catch(() => {});
    });
  }, []);

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

      <div className="work-rail" ref={railRef}>
        <div className="work-track">
          {WORK.map((item, i) => (
            <WorkTile key={`a-${i}`} item={item} onOpen={setOpen} />
          ))}
          {WORK.map((item, i) => (
            <WorkTile key={`b-${i}`} item={item} onOpen={setOpen} hidden />
          ))}
        </div>
      </div>

      <div className="wrap">
        <p className="work-note rv">
          Full reels &amp; client results on{" "}
          <a href={LINKS.instagram} target="_blank" rel="noopener">
            @droppablestudio
          </a>
        </p>
      </div>

      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

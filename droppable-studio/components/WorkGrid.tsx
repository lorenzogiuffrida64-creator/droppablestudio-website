"use client";

import { useEffect, useRef, useState } from "react";
import WorkTile from "@/components/WorkTile";
import Lightbox from "@/components/Lightbox";
import { LINKS } from "@/config/links";
import { WORK, type WorkItem } from "@/config/work";

export default function WorkGrid() {
  const [open, setOpen] = useState<WorkItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* previews play only while on screen; with reduced motion they stay
     paused on their first frame (the lightbox is always user-initiated) */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vids = gridRef.current?.querySelectorAll("video");
    if (!vids?.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.25 }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="work-head">
          <div>
            <p className="eyebrow rv">02 / The work</p>
            <h2 className="rv d1">Selected campaigns</h2>
          </div>
          <p className="rv d2">
            One studio, every industry. Each piece below is a fully AI-produced
            campaign — replace these frames with your live reels.
          </p>
        </div>

        <div className="work-grid" ref={gridRef}>
          {WORK.map((item, i) => (
            <WorkTile
              key={item.ph}
              item={item}
              delay={i % 3 === 1 ? 1 : i % 3 === 2 ? 2 : undefined}
              onOpen={setOpen}
            />
          ))}
        </div>

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

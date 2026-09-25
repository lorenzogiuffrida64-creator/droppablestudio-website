"use client";

import { useEffect, useRef, useState } from "react";

/* Shimmer placeholder for the media element that follows it in the DOM.
   It sits under a <video> (a frame-less video paints transparent, so the
   shimmer shows through until the first frame or poster lands) and fades out
   once that media is ready. Works without JS: the media simply covers it.
   Place it immediately BEFORE the <video> / <iframe> it waits on. */
export default function Skel({ light }: { light?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const media = ref.current?.nextElementSibling;
    if (!media) return;
    const finish = () => setDone(true);
    const fallback = window.setTimeout(finish, 10000); // never shimmer forever
    const cleanup: (() => void)[] = [() => window.clearTimeout(fallback)];

    const listen = (el: EventTarget, events: string[]) => {
      events.forEach((e) => el.addEventListener(e, finish, { once: true }));
      cleanup.push(() => events.forEach((e) => el.removeEventListener(e, finish)));
    };

    if (media instanceof HTMLVideoElement) {
      if (media.readyState >= 2) finish(); // loaded before hydration
      else listen(media, ["loadeddata", "error"]);
      // preload="none" cards only ever show their poster until played
      if (media.poster && media.preload === "none") {
        const img = new Image();
        listen(img, ["load", "error"]);
        img.src = media.poster;
        if (img.complete) finish();
      }
    } else if (media instanceof HTMLIFrameElement) {
      listen(media, ["load"]);
    }
    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <span
      ref={ref}
      className={`skel${light ? " skel--light" : ""}${done ? " is-done" : ""}`}
      aria-hidden="true"
    />
  );
}

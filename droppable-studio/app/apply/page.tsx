import type { Metadata } from "next";
import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";
import ReelCarousel from "@/components/ReelCarousel";
import { WORK, type WorkItem } from "@/config/work";

/* Hidden hiring page — reached only by a link we send personally.
   noindex keeps it out of search; it is linked from nowhere on the site. */
export const metadata: Metadata = {
  title: "Join the studio — Droppable Studio",
  description:
    "Apply to join Droppable Studio. Show us the work — if it moves us, we reply on WhatsApp within 72 hours.",
  robots: { index: false, follow: false },
};

/* the bar we hold applicants to — four studio reels */
const LEVEL_VIDEOS = [
  "/reels/reel-dji.mp4",
  "/reels/rolex.mp4",
  "/reels/reel-6.mp4",
  "/reels/reel-0507.mp4",
];
const LEVEL: WorkItem[] = LEVEL_VIDEOS.map(
  (v) => WORK.find((w) => w.video === v)
).filter((w): w is WorkItem => Boolean(w));

export default function ApplyPage() {
  return (
    <>
      <header className="inq-head">
        <Link href="/" className="brand">
          <img src="/logo-blue.png" alt="Droppable Studio logo" />
          Droppable&nbsp;Studio
        </Link>
        <Link href="/" className="inq-back">
          <span className="arr" aria-hidden="true">
            ←
          </span>{" "}
          Back to site
        </Link>
      </header>

      <main>
        <ApplyForm />

        <section className="dark level">
          <div className="wrap">
            <h2>
              This is <em>the level.</em>
            </h2>
          </div>
          {/* the set is small, so each reel appears twice per list — one list
              must outsize the viewport for the loop wrap to stay seamless */}
          <ReelCarousel items={[...LEVEL, ...LEVEL]} />
          <div className="wrap">
            <p className="apply-setbar">Set the bar</p>
          </div>
        </section>
      </main>
    </>
  );
}

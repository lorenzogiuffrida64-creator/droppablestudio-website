import type { Metadata } from "next";
import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";
import ReelCarousel from "@/components/ReelCarousel";
import {
  ApplyHero,
  ApplySteps,
  QuestionParts,
} from "@/components/hiring/Sections";
import StickyLoomCta from "@/components/hiring/StickyLoomCta";
import { WORK, type WorkItem } from "@/config/work";

/* Hidden hiring page — reached only by a link we send personally.
   noindex keeps it out of search; it is linked from nowhere on the site. */
export const metadata: Metadata = {
  title: "AI Artist application — Droppable Studio",
  description:
    "Apply to join Droppable Studio as an AI Artist: record one Loom video answering our questions, then submit the link.",
  robots: { index: false, follow: false },
};

/* the bar we hold applicants to — every studio reel on the site, led by these four */
const LEAD_VIDEOS = [
  "/reels/reel-dji.mp4",
  "/reels/rolex.mp4",
  "/reels/reel-6.mp4",
  "/reels/reel-0507.mp4",
];
const REELS = WORK.filter((w) => Boolean(w.video));
const LEVEL: WorkItem[] = [
  ...LEAD_VIDEOS.map((v) => REELS.find((w) => w.video === v)).filter(
    (w): w is WorkItem => Boolean(w)
  ),
  ...REELS.filter((w) => !LEAD_VIDEOS.includes(w.video ?? "")),
];

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

      <main className="hq-main">
        <ApplyHero />
        <ApplySteps />
        <QuestionParts />
        <ApplyForm />

        <section className="dark level">
          <div className="wrap">
            <h2>
              This is <em>the level.</em>
            </h2>
          </div>
          <ReelCarousel items={LEVEL} />
          <div className="wrap">
            <p className="apply-setbar">Set the bar</p>
          </div>
        </section>
      </main>
      <StickyLoomCta />
    </>
  );
}

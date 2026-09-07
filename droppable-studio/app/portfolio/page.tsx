import type { Metadata } from "next";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import PortfolioRing from "@/components/PortfolioRing";
import TypeLine from "@/components/TypeLine";
import { LINKS } from "@/config/links";
import { WORK, type WorkItem } from "@/config/work";

/* Secret portfolio — the whole reel on one wheel. Reached only by a link we
   send personally: noindex, and linked from nowhere on the site.

   It is a route of its own on purpose. The wheel keeps thirteen videos alive at
   once, so it stays off the home page — no drop canvas here either (see the
   hidden-routes list in DropCanvas), and nothing this page loads is shipped to
   visitors who never open it. */
export const metadata: Metadata = {
  title: "Portfolio — Droppable Studio",
  description:
    "Every Droppable Studio campaign on one slow-turning wheel — luxury, fashion, tech, real estate, music.",
  robots: { index: false, follow: false },
};

/* Every reel we ship, in the order config/work.ts lists them — the ring is
   derived, not hand-listed, so adding a reel there puts it on the wheel too. */
const RING: WorkItem[] = WORK.filter((w) => Boolean(w.video));

export default function PortfolioPage() {
  return (
    <>
      <header className="inq-head pf-head">
        <Link href="/" className="brand">
          <img src="/logo-sage.png" alt="Droppable Studio logo" />
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
        <PortfolioRing items={RING}>
          <p className="eyebrow">Selected work — the full reel</p>
          <h1>
            Let&rsquo;s create something <em>exceptional.</em>
          </h1>
          <p className="pf-type">
            We make the internet <TypeLine />
          </p>
          <Link className="btn" href={LINKS.inquiry}>
            Start a project <span className="arr">→</span>
          </Link>
        </PortfolioRing>

        <section className="pf-clients">
          <div className="wrap">
            <p className="eyebrow">Brands we&rsquo;ve worked with</p>
          </div>
          <Marquee />
        </section>
      </main>
    </>
  );
}

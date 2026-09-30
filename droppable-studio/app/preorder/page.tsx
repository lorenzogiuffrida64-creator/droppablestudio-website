import type { Metadata } from "next";
import Link from "next/link";
import { PREORDER } from "@/config/preorder";
import { ClockProvider } from "@/components/PreorderClock";
import { AnnouncementBar, StickyCta } from "@/components/method/Pricing";
import { PageView } from "@/components/method/Tracking";
import {
  Hero,
  Work,
  Inside,
  Bonuses,
  Path,
  Founder,
  Testimonials,
  Offer,
  Faq,
  FinalCta,
  Foot,
} from "@/components/method/Sections";

export const metadata: Metadata = {
  title: "The Droppable Method — Founding pre-order",
  description:
    "Learn the exact system behind every Droppable campaign. Pre-order a founding seat before the price rises.",
  openGraph: {
    title: "The Droppable Method — Founding pre-order",
    description:
      "Learn the exact system behind every Droppable campaign. Pre-order a founding seat before the price rises.",
    /* images: [[OG_IMAGE — Lorenzo to provide]] */
  },
};

/**
 * Preview override for QA: `?at=2026-10-03T12:00:00+02:00` pins the clock,
 * `?preview=launch` jumps past launch. Always on in development; in production
 * only with `&key=<PREVIEW_SECRET>`. Display only — checkout always prices
 * from the real server clock.
 */
function previewOffset(q: Record<string, string | string[] | undefined>, now: number) {
  const str = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : undefined);
  const allowed =
    process.env.NODE_ENV !== "production" ||
    (!!process.env.PREVIEW_SECRET && str("key") === process.env.PREVIEW_SECRET);
  if (!allowed) return 0;
  if (str("preview") === "launch") return PREORDER.launchAt + 60_000 - now;
  const at = str("at") ? Date.parse(str("at")!) : NaN;
  return Number.isNaN(at) ? 0 : at - now;
}

export default async function PreorderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  /* reading searchParams renders per request: the countdown starts from the
     server's clock, so first paint is already correct */
  const q = await searchParams;
  const now = Date.now();
  const offset = previewOffset(q, now);

  return (
    <ClockProvider initialNow={now + offset} offset={offset}>
      <PageView />
      <AnnouncementBar />
      <header className="m-head">
        <Link href="/" className="brand">
          <img src="/logo-blue.png" alt="Droppable Studio logo" />
          Droppable&nbsp;Studio
        </Link>
        <Link href="/" className="inq-back">
          <span className="arr" aria-hidden="true">
            ←
          </span>{" "}
          Main site
        </Link>
      </header>

      <main className="method">
        <Hero />
        <Testimonials />
        <Work />
        <Inside />
        <Bonuses />
        <Path />
        <Founder />
        <Offer />
        <Faq />
        <FinalCta />
      </main>
      <Foot />
      <StickyCta />
    </ClockProvider>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageView, StickyCta } from "@/components/school/Client";
import {
  Hero,
  Testimonials,
  Work,
  Challenge,
  Roadmap,
  Classroom,
  Inside,
  Pricing,
  GoFurther,
  Mentors,
  Faq,
  FinalCta,
  Foot,
} from "@/components/school/Sections";

const title =
  "The Droppable Method: Learn to Create AI Commercials | Droppable Studio";
const description =
  "The exact AI workflow behind every Droppable Studio campaign. Start with a 7-day challenge, make your first AI ad, and land your first client.";

export const metadata: Metadata = {
  metadataBase: new URL("https://droppablestudio.com"),
  title,
  description,
  alternates: { canonical: "/school" },
  openGraph: {
    title,
    description,
    url: "/school",
    type: "website",
    images: [{ url: "/method/vsl-poster.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/method/vsl-poster.jpg"],
  },
};

export default function SchoolPage() {
  return (
    <>
      <PageView />
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
        <Challenge />
        <Roadmap />
        <Classroom />
        <Inside />
        <Pricing />
        <GoFurther />
        <Mentors />
        <Faq />
        <FinalCta />
      </main>
      <Foot />
      <StickyCta />
    </>
  );
}

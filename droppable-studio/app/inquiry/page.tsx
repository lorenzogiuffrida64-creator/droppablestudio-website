import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import Reveals from "@/components/Reveals";

export const metadata: Metadata = {
  title: "Start a project — Droppable Studio",
  description:
    "Tell us about your brand, your audience and your goal. Start an AI campaign with Droppable Studio.",
};

export default function InquiryPage() {
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
        <InquiryForm />
      </main>

      {/* scroll-reveal for the .rv field groups (only mounted on the home page otherwise) */}
      <Reveals />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import { INQUIRY_TYPES, type InquiryType } from "@/config/inquiry";
import Reveals from "@/components/Reveals";

export const metadata: Metadata = {
  title: "Start a project — Droppable Studio",
  description:
    "Tell us about your brand, your audience and your goal. Start an AI campaign with Droppable Studio.",
};

export default async function InquiryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type } = await searchParams;
  const inquiryType =
    typeof type === "string" && type in INQUIRY_TYPES
      ? (type as InquiryType)
      : undefined;
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
        <InquiryForm type={inquiryType} />
      </main>

      {/* scroll-reveal for the .rv field groups (only mounted on the home page otherwise) */}
      <Reveals />
    </>
  );
}

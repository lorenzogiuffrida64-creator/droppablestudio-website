import type { Metadata } from "next";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import Reveals from "@/components/Reveals";

/* Hidden page — reached only by a link we send personally to a lead whose
   strategy call is already booked but whose brief never reached us. Same
   form as /inquiry minus the Calendly step. noindex, linked from nowhere. */
export const metadata: Metadata = {
  title: "Your brief — Droppable Studio",
  description:
    "Your call is booked. Tell us about your brand so we arrive prepared.",
  robots: { index: false, follow: false },
};

export default function BriefPage() {
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
        <InquiryForm callBooked />
      </main>

      <Reveals />
    </>
  );
}

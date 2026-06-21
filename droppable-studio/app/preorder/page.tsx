import type { Metadata } from "next";
import Link from "next/link";
import PreorderForm from "@/components/PreorderForm";

export const metadata: Metadata = {
  title: "Pre-order — The Droppable Method",
  description:
    "Founding pre-order for the Droppable Method (Skool). Lock your seat at 50% off — full access when the community opens.",
};

export default function PreorderPage() {
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
        <PreorderForm />
      </main>
    </>
  );
}

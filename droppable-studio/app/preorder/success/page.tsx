import type { Metadata } from "next";
import Link from "next/link";
import { DISCOUNT_PERCENT } from "@/config/preorder";

export const metadata: Metadata = {
  title: "Pre-order confirmed — Droppable Studio",
  description: "Your founding seat in The Droppable Method is reserved.",
};

export default function PreorderSuccessPage() {
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
        <section className="inquiry">
          <div className="wrap">
            <div className="inq-done">
              <img
                className="inq-king"
                src="/logo-blue.png"
                alt=""
                aria-hidden="true"
              />
              <p className="eyebrow">Pre-order confirmed</p>
              <h2>
                You&apos;re <em>in.</em>
              </h2>
              <p>
                Your founding seat is reserved and the {DISCOUNT_PERCENT}% rate is
                locked. Check
                your inbox for the confirmation — we&apos;ll email you the moment
                The Droppable Method opens, with your access details.
              </p>
              <Link className="btn" href="/">
                Back to site
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

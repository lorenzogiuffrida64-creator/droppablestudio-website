import type { Metadata } from "next";
import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { PREORDER, formatDay, formatTime, formatPrice } from "@/config/preorder";
import { METHOD } from "@/config/method";
import { LINKS } from "@/config/links";

export const metadata: Metadata = {
  title: "Pre-order confirmed — Droppable Studio",
  description: "Your founding seat in The Droppable Method is reserved.",
  robots: { index: false },
};

/* the price actually paid, read back from the Stripe session */
async function paidCents(sessionId: string | undefined): Promise<number | null> {
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const s = await getStripe().checkout.sessions.retrieve(sessionId);
    return s.payment_status === "paid" ? s.amount_total : null;
  } catch {
    return null;
  }
}

export default async function PreorderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const cents = await paidCents(
    typeof q.session_id === "string" ? q.session_id : undefined
  );
  const opens = `${formatDay(PREORDER.launchAt)} at ${formatTime(PREORDER.launchAt)}`;

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
                {cents != null ? (
                  <>
                    Your founding price of <b>{formatPrice(cents)}</b> is locked.
                  </>
                ) : (
                  <>Your founding seat is reserved and your price is locked.</>
                )}{" "}
                Check your inbox for the confirmation. The Droppable Method
                opens {opens} (CET), and we&apos;ll email you your
                access details that day.
              </p>
              {METHOD.postPurchase ? (
                <ol className="m-next">
                  {METHOD.postPurchase.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              ) : process.env.NODE_ENV !== "production" ? (
                <div className="m-todo">
                  [[POST_PURCHASE_STEPS — Lorenzo to provide]]
                </div>
              ) : null}
              <p>Until then, come say hi in the free Discord.</p>
              <div className="m-done-ctas">
                <a className="btn" href={LINKS.discord} target="_blank" rel="noopener">
                  Join the Discord
                </a>
                <Link className="btn ghost" href="/">
                  Back to site
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

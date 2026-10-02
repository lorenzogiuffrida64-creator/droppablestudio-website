"use client";

import { useNow } from "@/components/PreorderClock";
import { goToCheckout } from "@/components/method/Pricing";
import {
  PREORDER,
  priceAt,
  stateAt,
  formatPrice,
} from "@/config/preorder";
import { BONUSES, METHOD, SCHOOL, type Bonus } from "@/config/method";
import { track } from "@/lib/track";

/* ---------- founders-only bonuses ----------
   Every price here comes from priceAt() in config/preorder.ts — the same
   helper the checkout route charges with — read from the page's
   server-seeded clock, so the first render already shows today's price and
   all prices in the section always match each other and the checkout.
   After launch the offer is gone: the section closes itself. */

function useFounderPrice() {
  const now = useNow() ?? 0;
  return {
    open: stateAt(now) === "preorder",
    today: formatPrice(priceAt(now).cents),
    launch: formatPrice(PREORDER.launchPriceCents),
  };
}

function Caption({ title, subtitle, line }: { title: string; subtitle?: string; line: string }) {
  return (
    <figcaption>
      <b>{title}</b>
      {subtitle && <i className="bonus-sub">{subtitle}</i>}
      <span>{line}</span>
    </figcaption>
  );
}

function BonusObject({ b }: { b: Bonus }) {
  return (
    <figure className={`bonus bonus--${b.id}`}>
      <div className="bonus-art" aria-hidden="true">
        {b.id === "pdf" ? (
          <div className="pdf">
            <span className="pdf-page p3" />
            <span className="pdf-page p2" />
            <span className="pdf-cover">
              <img src="/logo-sage.png" alt="" width={26} height={26} />
              <b>{b.figure}</b>
              <em>pages of prompts</em>
              <i className="pdf-lines" />
              <span className="pdf-type">PDF</span>
            </span>
          </div>
        ) : (
          <div className="sheet">
            <span className="sheet-top">
              <i />
              <i />
              <i />
            </span>
            <span className="sheet-grid">
              {Array.from({ length: 24 }, (_, i) => (
                <i key={i} className={i === 9 ? "sel" : i < 3 ? "hd" : undefined} />
              ))}
            </span>
            <span className="sheet-tabs">
              <b>Keywords</b>
              <span>Sources</span>
            </span>
          </div>
        )}
      </div>
      <Caption title={b.title} line={b.line} />
    </figure>
  );
}

export default function Founders() {
  const { open, today, launch } = useFounderPrice();
  const [codex, decoder] = BONUSES;
  const { counter } = METHOD;

  if (!open) {
    const showCount = counter.value >= counter.minToShow;
    return (
      <section className="m-section m-bonus m-bonus--closed" aria-labelledby="m-bonus-h">
        <div className="wrap m-bonus-head">
          <h2 id="m-bonus-h">Founding seats are closed.</h2>
          {showCount && (
            <p>
              <b className="tnum">
                {counter.value}
                {counter.plus ? "+" : ""}
              </b>{" "}
              founding members got in.
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="m-section m-bonus" aria-labelledby="m-bonus-h">
      <div className="wrap">
        <div className="m-bonus-head">
          <h2 id="m-bonus-h">Founding members get all of it. After launch, nobody will.</h2>
          <p>Pre-order only. Gone for good when the school opens.</p>
          <span className="founders-pill">Founders only</span>
        </div>

        <div className="bonus-eq bonus-eq--4">
          {/* 1 — the Founders' Room */}
          <figure className="bonus bonus--seat">
            <div className="seat">
              <img src="/logo-sage.png" alt="" width={34} height={34} />
              <span className="seat-k">Your founding seat</span>
              <b className="seat-name">The Droppable Method</b>
              <span className="seat-price">{today}/mo today</span>
            </div>
            <Caption
              title="The Founders' Room"
              line={`All ${SCHOOL.lessonCount} lessons, live workshops and the network.`}
            />
          </figure>
          <span className="eq-op eq-op--1" aria-hidden="true">+</span>

          {/* 2 — the Codex, 3 — the Decoder */}
          <BonusObject b={codex} />
          <span className="eq-op eq-op--2" aria-hidden="true">+</span>
          <BonusObject b={decoder} />
          <span className="eq-op eq-op--3" aria-hidden="true">+</span>

          {/* 4 — Founder's Rate */}
          <figure className="bonus bonus--rate">
            <div className="bonus-art" aria-hidden="true">
              <div className="rate">
                <span className="rate-k">Founder&apos;s rate</span>
                <b className="rate-now tnum">
                  {today}
                  <small>/mo</small>
                </b>
                <span className="rate-later">{launch}/mo after launch</span>
              </div>
                  </div>
            <Caption
              title="Founder's Rate"
              line="Locked as long as you stay subscribed."
            />
          </figure>
        </div>

        <div className="fclose">
          <p>
            All four for <b className="tnum">{today}/mo</b>, today only.
          </p>
          <button
            type="button"
            className="btn m-cta"
            onClick={() => {
              track("bonus_cta_click", { price: priceAt(Date.now()).cents / 100 });
              goToCheckout();
            }}
          >
            Claim my founding seat
          </button>
        </div>
      </div>
    </section>
  );
}

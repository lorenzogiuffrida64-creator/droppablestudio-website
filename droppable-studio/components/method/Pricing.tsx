"use client";

import { useEffect, useState } from "react";
import { useNow } from "@/components/PreorderClock";
import {
  PREORDER,
  priceAt,
  stateAt,
  ladderAt,
  formatPrice,
  formatMonthly,
  formatCountdown,
  formatDay,
} from "@/config/preorder";
import { LINKS } from "@/config/links";
import { track } from "@/lib/track";

/* Everything on /preorder that reads the clock. All of it sits inside the
   server-seeded ClockProvider, so `useNow()` is never null here. */
function useClock() {
  const now = useNow() ?? 0;
  const state = stateAt(now);
  const price = priceAt(now);
  /* before launch but past the last step: count down to the doors opening */
  const target = price.nextAt ?? PREORDER.launchAt;
  return { now, state, price, target, left: formatCountdown(target - now) };
}

const launchPrice = () => formatPrice(PREORDER.launchPriceCents);

/* ---------- 5.1 announcement bar ---------- */
export function AnnouncementBar() {
  const { state, price, left } = useClock();
  return (
    <div className="m-bar" role="timer" aria-live="off">
      <span className="m-bar-dot" aria-hidden="true" />
      {state === "launch" ? (
        <span>
          The Droppable Method is open · {launchPrice()}/month
        </span>
      ) : (
        <span>
          {price.nextAt != null ? "Price rises in" : "Pre-order closes in"}{" "}
          <b className="tnum">{left}</b>
          <span className="m-bar-sep" aria-hidden="true">·</span>
          Today {formatMonthly(price.cents)}
        </span>
      )}
    </div>
  );
}

/* ---------- price ladder: today / tomorrow / launch ---------- */
export function LadderCompact() {
  const { now, state, price, left } = useClock();
  if (state === "launch") {
    return (
      <div className="ladder ladder--open">
        <p className="ladder-open">
          <b>{launchPrice()}</b>
          <span>/month</span>
        </p>
      </div>
    );
  }
  const nextLabel =
    price.nextAt != null && price.nextAt - now <= 86_400_000
      ? "Tomorrow"
      : price.nextAt != null
        ? formatDay(price.nextAt)
        : null;
  /* today in blu; every later price is the one to avoid — red, pulsing */
  const Mo = ({ cents }: { cents: number }) => (
    <span className="ladder-v">
      {formatPrice(cents)}
      <small>/mo</small>
    </span>
  );
  return (
    <div className="ladder">
      <ol className="ladder-row" aria-label="Pre-order price ladder">
        <li className="is-today">
          <span className="ladder-k">Today</span>
          <Mo cents={price.cents} />
        </li>
        {nextLabel && price.nextCents != null && (
          <li className="is-urgent">
            <LadderArrow />
            <span className="ladder-k">{nextLabel}</span>
            <Mo cents={price.nextCents} />
          </li>
        )}
        <li className="is-urgent is-launch">
          <LadderArrow />
          <span className="ladder-k">At launch</span>
          <Mo cents={PREORDER.launchPriceCents} />
        </li>
      </ol>
      <p className="ladder-timer">
        {price.nextAt != null ? "Price rises in" : "Pre-order closes in"}{" "}
        <b className="tnum">{left}</b>
      </p>
    </div>
  );
}

/* the step between two prices: sits on the divider, pointing at the rise */
function LadderArrow() {
  return (
    <span className="ladder-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5 12h13M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

/* ---------- 5.10 the full schedule, drawn as a staircase ---------- */
export function LadderFull() {
  const { now } = useClock();
  const steps = ladderAt(now);
  const max = PREORDER.launchPriceCents;
  const h = (cents: number) => `${Math.max(8, (cents / max) * 100)}%`;
  return (
    <ol className="stairs" aria-label="Full price schedule">
      {steps.map((s) => (
        <li
          key={s.from}
          className={`stair is-${s.status}`}
          aria-current={s.status === "today" ? "true" : undefined}
        >
          <span className="stair-price">
            {formatPrice(s.cents)}
            <small>/mo</small>
          </span>
          <span className="stair-bar" style={{ height: h(s.cents) }}>
            {s.status === "today" && <span className="stair-tag">Today</span>}
          </span>
          <span className="stair-day">
            {formatDay(s.from)
              .split(" ")
              .slice(0, 2)
              .map((part) => (
                <span key={part}>{part}</span>
              ))}
          </span>
          <span className="sr-only">
            {s.status === "passed" ? " (passed)" : s.status === "today" ? " (today)" : ""}
          </span>
        </li>
      ))}
      <li className="stair is-launch">
        <span className="stair-price">
          {launchPrice()}
          <small>/mo</small>
        </span>
        <span className="stair-bar" style={{ height: "100%" }} />
        <span className="stair-day">Launch</span>
      </li>
    </ol>
  );
}

/* ---------- the seat button (hero, final CTA, sticky bar) ----------
   Pre-order: scrolls to the checkout form in the offer section (the one real
   buy button). Launch: joins the Skool directly. */
export function SeatButton({
  source,
  short = false,
  className = "btn",
}: {
  source: "hero_cta_click" | "sticky_cta_click" | "final_cta_click";
  short?: boolean;
  className?: string;
}) {
  const { state, price } = useClock();
  if (state === "launch") {
    return (
      <a
        className={className}
        href={LINKS.skool}
        target="_blank"
        rel="noopener"
        onClick={() => track(source, { state })}
      >
        Join now
      </a>
    );
  }
  return (
    <a
      className={className}
      href="#checkout"
      onClick={(e) => {
        e.preventDefault();
        track(source, { price: price.cents / 100 });
        goToCheckout();
      }}
    >
      {short ? "Lock my seat" : `Lock my price at just ${formatMonthly(price.cents)}`}
    </a>
  );
}

export function goToCheckout() {
  const target = document.getElementById("checkout");
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `${location.search}#checkout`);
  /* desktop: put the cursor in the first field. Touch: don't pop the keyboard. */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.getElementById("firstName")?.focus({ preventScroll: true });
  }
}

/* ---------- 5.12 final CTA line ---------- */
export function FinalLine() {
  const { state, price, left } = useClock();
  if (state === "launch") {
    return (
      <>
        <h2>The doors are open.</h2>
        <p className="m-final-sub">{launchPrice()}/month. Start today.</p>
      </>
    );
  }
  return (
    <>
      <h2>Your seat is {formatMonthly(price.cents)} today.</h2>
      <p className="m-final-sub">
        {price.nextCents != null ? (
          <>
            It becomes {formatMonthly(price.nextCents)} in{" "}
            <b className="tnum">{left}</b>.
          </>
        ) : (
          <>
            The pre-order closes in <b className="tnum">{left}</b>.
          </>
        )}
      </p>
    </>
  );
}

/* ---------- 5.13 sticky mobile CTA ----------
   Shows once the hero has scrolled away; hides while the checkout form or the
   footer is on screen, so it never sits on top of the thing it points to. */
export function StickyCta() {
  const { state, price } = useClock();
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const blockers = ["checkout", "m-foot"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const seen = new Set<Element>();

    const heroIo = new IntersectionObserver(([e]) =>
      setPastHero(!e.isIntersecting && e.boundingClientRect.top < 0)
    );
    const blockIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setBlocked(seen.size > 0);
    });
    if (hero) heroIo.observe(hero);
    blockers.forEach((b) => blockIo.observe(b));
    return () => {
      heroIo.disconnect();
      blockIo.disconnect();
    };
  }, []);

  const show = pastHero && !blocked;
  return (
    <div className={`m-sticky${show ? " is-on" : ""}`} inert={!show}>
      <p className="m-sticky-price">
        {state === "launch" ? (
          <>
            <b>{launchPrice()}</b>/month
          </>
        ) : (
          <>
            <b>{formatPrice(price.cents)}</b>/mo today
          </>
        )}
      </p>
      <SeatButton source="sticky_cta_click" short className="btn" />
    </div>
  );
}

/* show children only in one launch state (server-rendered, clock-seeded) */
export function OnlyIn({
  state,
  children,
}: {
  state: "preorder" | "launch";
  children: React.ReactNode;
}) {
  const { state: current } = useClock();
  return current === state ? <>{children}</> : null;
}

export function SeatPrice() {
  const { state, price } = useClock();
  return (
    <>{state === "launch" ? `${launchPrice()}/mo` : `${formatMonthly(price.cents)} today`}</>
  );
}

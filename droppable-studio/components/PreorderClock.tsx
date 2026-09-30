"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  PREORDER,
  priceAt,
  formatPrice,
  formatCountdown,
  formatLaunchPrice,
} from "@/config/preorder";

/* Server-seeded clock for the /preorder landing page: the page is rendered per
   request, the server passes its own time (plus any preview offset) down, and
   every countdown hydrates from that exact value — so first paint is already
   right, never "00:00:00". */
const ClockCtx = createContext<number | null>(null);

export function ClockProvider({
  initialNow,
  offset = 0,
  children,
}: {
  initialNow: number;
  /* preview override: ms added to the real clock (0 in production) */
  offset?: number;
  children: React.ReactNode;
}) {
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const tick = () => setNow(Date.now() + offset);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offset]);
  return <ClockCtx.Provider value={now}>{children}</ClockCtx.Provider>;
}

/** Wall clock ticking every second. Inside a ClockProvider it's the seeded
 *  clock; elsewhere (the statically rendered home page) it's null until
 *  mounted, so a build-time price is never shown. */
export function useNow(): number | null {
  const seeded = useContext(ClockCtx);
  const [local, setLocal] = useState<number | null>(null);
  useEffect(() => {
    if (seeded != null) return;
    setLocal(Date.now());
    const id = setInterval(() => setLocal(Date.now()), 1000);
    return () => clearInterval(id);
  }, [seeded]);
  return seeded ?? local;
}

/** "7 days 01h 58m 37s" — units spelled out so the launch date reads at a glance. */
function launchParts(ms: number): { days: string; hms: string } {
  const t = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(t / 86400);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    days: d > 0 ? `${d} ${d === 1 ? "day" : "days"}` : "",
    hms: `${pad(Math.floor((t % 86400) / 3600))}h ${pad(
      Math.floor((t % 3600) / 60)
    )}m ${pad(t % 60)}s`,
  };
}

/** Bar on top of the Skool card: countdown to the Skool release. */
export function PreorderRibbon() {
  const now = useNow();
  const open = now != null && now >= PREORDER.launchAt;
  const parts = launchParts(now == null ? 0 : PREORDER.launchAt - now);
  return (
    <span className="launch-bar" role="timer">
      <span className={now == null ? "is-pending" : undefined}>
        {open ? (
          <span className="launch-bar-label">Now open</span>
        ) : (
          <>
            <span className="launch-bar-label">Launching in</span>{" "}
            {parts.days && <b className="launch-bar-days">{parts.days}</b>}{" "}
            <span className="launch-bar-hms tnum">{parts.hms}</span>
          </>
        )}
      </span>
    </span>
  );
}

/** Home-page Skool card: the same ladder as /preorder (today / next / launch)
 *  plus "price rises in hh:mm:ss". No crossed-out reference price. */
export function PreorderPriceLine() {
  const now = useNow();
  /* pre-mount placeholder (hidden) uses a fixed time so SSR and hydration match */
  const p = priceAt(now ?? 0);
  const open = now != null && now >= PREORDER.launchAt;
  return (
    <div className={now == null ? "is-pending" : undefined}>
      {open ? (
        <p className="preorder-price">
          <span className="now">{formatLaunchPrice()}</span>
        </p>
      ) : (
        <p className="preorder-price">
          <span className="now">{formatPrice(p.cents)}</span>
          <span className="off">today</span>
          {p.nextCents != null && (
            <span className="then">then {formatPrice(p.nextCents)}</span>
          )}
          <span className="then">· {formatLaunchPrice()} at launch</span>
        </p>
      )}
      {!open && p.nextAt != null && p.nextCents != null && now != null && (
        <p className="preorder-next" role="timer">
          <span className="preorder-next-dot" aria-hidden="true" />
          Price rises to {formatPrice(p.nextCents)} in{" "}
          <b className="tnum">{formatCountdown(p.nextAt - now)}</b>
        </p>
      )}
    </div>
  );
}

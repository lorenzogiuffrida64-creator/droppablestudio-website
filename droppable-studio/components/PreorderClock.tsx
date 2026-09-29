"use client";

import { useEffect, useState } from "react";
import {
  PREORDER,
  priceAt,
  formatPrice,
  formatCountdown,
  discountPercent,
} from "@/config/preorder";

/** Wall clock ticking every second. null until mounted: the home page is
 *  statically rendered, so the build-time price must never be shown. */
export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
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

/** Struck launch price, live price, discount + "price rises to €X in hh:mm:ss". */
export function PreorderPriceLine({ large = false }: { large?: boolean }) {
  const now = useNow();
  /* pre-mount placeholder (hidden) uses a fixed time so SSR and hydration match */
  const p = priceAt(now ?? 0);
  return (
    <div className={now == null ? "is-pending" : undefined}>
      <p className={`preorder-price${large ? " preorder-price--lg" : ""}`}>
        {!p.full && (
          <span className="was">{formatPrice(PREORDER.launchPriceCents)}</span>
        )}
        <span className="now">{formatPrice(p.cents)}</span>
        {!p.full && (
          <span className="off">
            {discountPercent(p.cents)}% off · founding seat
          </span>
        )}
      </p>
      {p.nextAt != null && p.nextCents != null && now != null && (
        <p className="preorder-next" role="timer">
          <span className="preorder-next-dot" aria-hidden="true" />
          Price rises to {formatPrice(p.nextCents)} in{" "}
          <b className="tnum">{formatCountdown(p.nextAt - now)}</b>
        </p>
      )}
    </div>
  );
}

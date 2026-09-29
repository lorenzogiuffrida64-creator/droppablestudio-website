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

/** Diagonal ribbon on the Skool card: countdown to the Skool release. */
export function PreorderRibbon() {
  const now = useNow();
  const open = now != null && now >= PREORDER.launchAt;
  return (
    <span className="uc-banner" role="timer">
      <span className={`uc-banner-label${now == null ? " is-pending" : ""}`}>
        {open ? (
          <>◆ Now open ◆</>
        ) : (
          <>
            ◆ Launching in{" "}
            <span className="tnum">
              {now == null ? "0d 00:00:00" : formatCountdown(PREORDER.launchAt - now)}
            </span>{" "}
            ◆
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
          Price rises to {formatPrice(p.nextCents)} in{" "}
          <span className="tnum">{formatCountdown(p.nextAt - now)}</span>
        </p>
      )}
    </div>
  );
}

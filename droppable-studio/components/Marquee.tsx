import type { CSSProperties } from "react";
import { CLIENTS } from "@/config/clients";

export default function Marquee() {
  if (CLIENTS.length === 0) return null;

  return (
    <section className="marquee" aria-label="Brands we've worked with">
      <div className="marquee-track">
        {/* list doubled so the -50% slide loops seamlessly */}
        {[...CLIENTS, ...CLIENTS].map((c, i) => {
          const isDuplicate = i >= CLIENTS.length;
          return (
            <span
              key={i}
              className="marquee-logo"
              style={
                {
                  "--logo": `url(${c.logo})`,
                  ...(c.width ? { "--logo-w": `${c.width}px` } : {}),
                } as CSSProperties
              }
              // expose names once; the duplicate copy is decorative
              {...(isDuplicate
                ? { "aria-hidden": true }
                : { role: "img", "aria-label": c.name })}
            />
          );
        })}
      </div>
    </section>
  );
}

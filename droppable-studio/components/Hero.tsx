import Link from "next/link";
import TypeLine from "@/components/TypeLine";
import { LINKS } from "@/config/links";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="eyebrow rv">AI marketing agency — worldwide</p>
        <h1 className="rv d1">
          We make the internet <TypeLine />
        </h1>
        <p className="rv d2">
          Droppable Studio crafts cinematic, AI campaigns for
          skincare, fashion, real estate, music and global brands.
        </p>
        <div className="hero-cta rv d3">
          <Link className="btn" href={LINKS.inquiry}>
            Start a project <span className="arr">→</span>
          </Link>
          <a className="btn ghost" href="#academy">
            AI school <span className="arr">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

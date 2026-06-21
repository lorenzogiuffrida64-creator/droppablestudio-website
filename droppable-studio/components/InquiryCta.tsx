import Link from "next/link";
import { LINKS } from "@/config/links";

export default function InquiryCta() {
  return (
    <section className="cta" id="contact">
      <div className="wrap">
        <p className="eyebrow rv">Work with us</p>
        <h2 className="rv d1">
          Your brand, in the feed, <em>by next week.</em>
        </h2>
        <p className="rv d2">
          Tell us about your brand, your audience and your goal.
        </p>
        <Link className="btn rv d3" href={LINKS.inquiry}>
          Complete the inquiry <span className="arr">→</span>
        </Link>
        <p className="cta-reassure rv d4">
          (No retainers required · NDA on request)
        </p>
      </div>
    </section>
  );
}

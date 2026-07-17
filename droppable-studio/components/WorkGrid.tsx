import ReelCarousel from "@/components/ReelCarousel";
import { LINKS } from "@/config/links";
import { WORK } from "@/config/work";

export default function WorkGrid() {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <div className="work-head">
          <div>
            <h2 className="rv d1">Selected campaigns</h2>
          </div>
          <p className="rv d2">
            One studio, every industry. Each reel is a fully AI-produced
            campaign — built to stop the scroll and move the numbers.
          </p>
        </div>
      </div>

      <ReelCarousel items={WORK} />

      <div className="wrap">
        <p className="work-note rv">
          Full reels &amp; client results on{" "}
          <a href={LINKS.instagram} target="_blank" rel="noopener">
            @droppablestudio
          </a>
        </p>
      </div>
    </section>
  );
}

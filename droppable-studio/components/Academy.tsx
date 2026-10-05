import Link from "next/link";
import { LINKS } from "@/config/links";
import { PreorderRibbon, PreorderPriceLine } from "@/components/PreorderClock";
import { SCHOOL } from "@/config/method";

// Discord card temporarily hidden — flip to true to bring it back.
const SHOW_DISCORD = false;

export default function Academy() {
  return (
    <section className="academy" id="academy">
      <div className="wrap">
        <div className="academy-panel">
          <div className="academy-head">
            <div>
              <h2 className="rv d1">Learn how we do it.</h2>
            </div>
            <p className="sub rv d2">
              For founders, creators and future agency owners: master
              generative AI, the exact tools we use, and the workflow behind
              every Droppable campaign — from your first render to your first
              client.
            </p>
          </div>

          <div className={SHOW_DISCORD ? "paths" : "paths solo"}>
            {SHOW_DISCORD && (
            <div className="path-card rv">
              <span className="tier">
                Discord — <b>Free</b>
              </span>
              <h3>The Community</h3>
              <ul>
                <li>Monthly drops: Claude Code guides, skills &amp; breakdowns</li>
                <li>Beginner roadmap to generative AI</li>
                <li>Share your work, get feedback — a 560+ community</li>
              </ul>
              <a
                className="btn ghost"
                href={LINKS.discord}
                target="_blank"
                rel="noopener"
              >
                Join free <span className="arr">→</span>
              </a>
            </div>
            )}

            <div className="path-card featured rv d1">
              <PreorderRibbon />
              <span className="tier">
                Skool — <b>The full system</b>
              </span>
              <h3>The Droppable Method</h3>
              <p className="path-lede">From 0 to hero in generative AI.</p>
              <ul>
                <li>{SCHOOL.lessonCount} lessons</li>
                {SCHOOL.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <PreorderPriceLine />
              <Link className="btn" href={LINKS.preorder}>
                Pre-order your seat <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

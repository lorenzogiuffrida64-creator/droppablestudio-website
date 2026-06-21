import Link from "next/link";
import { LINKS } from "@/config/links";
import { PREORDER_DISPLAY } from "@/config/preorder";

export default function Academy() {
  return (
    <section className="academy" id="academy">
      <div className="wrap">
        <div className="academy-panel">
          <div className="academy-head">
            <div>
              <p className="eyebrow rv">04 / The Academy</p>
              <h2 className="rv d1">Learn how we do it.</h2>
            </div>
            <p className="sub rv d2">
              For founders, creators and future agency owners: master
              generative AI, the exact tools we use, and the workflow behind
              every Droppable campaign — from your first render to your first
              client.
            </p>
          </div>

          <div className="paths">
            <div className="path-card rv">
              <span className="tier">
                Discord — <b>Free</b>
              </span>
              <h3>The Community</h3>
              <ul>
                <li>Weekly drops: prompts, tools &amp; breakdowns</li>
                <li>Beginner roadmap to generative AI</li>
                <li>Share your work, get feedback</li>
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

            <div className="path-card featured rv d1">
              <span className="uc-banner" role="status">
                <span className="uc-banner-label">
                  ◆ Under Construction · Launching Soon ◆
                </span>
              </span>
              <span className="tier">
                Skool — <b>The full system</b>
              </span>
              <h3>The Droppable Method</h3>
              <ul>
                <li>Complete AI ad-creation curriculum, tool by tool</li>
                <li>Agency playbook: pricing, clients, delivery</li>
                <li>Live calls, reviews &amp; private network</li>
              </ul>
              <p className="preorder-price">
                <span className="was">{PREORDER_DISPLAY.launch}</span>
                <span className="now">{PREORDER_DISPLAY.now}</span>
                <span className="off">{PREORDER_DISPLAY.off} · founding seat</span>
              </p>
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

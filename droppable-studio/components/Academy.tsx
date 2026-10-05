import Link from "next/link";
import { LINKS } from "@/config/links";
import { PreorderRibbon, PreorderPriceLine } from "@/components/PreorderClock";
import { SCHOOL } from "@/config/method";
import { DISCORD, getDiscordMemberCount } from "@/lib/discord";

export default async function Academy() {
  const members = await getDiscordMemberCount();
  const spotsLeft =
    members === null ? null : Math.max(DISCORD.freeSpots - members, 0);
  const fmt = (n: number) => n.toLocaleString("en-US");

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

          <div className="paths">
            <div className="path-card rv">
              <span className="tier">
                Discord — <b>Free</b>
              </span>
              <h3>The Community</h3>
              <p className="path-lede">
                Our 600-member server was hacked. We&rsquo;re starting over.
              </p>
              <ul>
                <li>Monthly drops: Claude Code guides, skills &amp; breakdowns</li>
                <li>Beginner roadmap to generative AI</li>
                <li>Share your work, get feedback</li>
              </ul>
              <div className="spots">
                <p className="spots-line">
                  {spotsLeft === null ? (
                    <>First <b>{fmt(DISCORD.freeSpots)}</b> members join free</>
                  ) : spotsLeft > 0 ? (
                    <><b>{fmt(spotsLeft)}</b> of {fmt(DISCORD.freeSpots)} free spots left</>
                  ) : (
                    <>Free spots are gone</>
                  )}
                </p>
                {spotsLeft !== null && (
                  <div className="spots-bar" aria-hidden="true">
                    <span
                      style={{
                        transform: `scaleX(${(DISCORD.freeSpots - spotsLeft) / DISCORD.freeSpots})`,
                      }}
                    />
                  </div>
                )}
                <p className="spots-note">
                  Then {DISCORD.entryFee} entry.
                  {members !== null && <> {fmt(members)} members and counting.</>}
                </p>
              </div>
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

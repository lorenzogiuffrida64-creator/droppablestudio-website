import Link from "next/link";
import { LINKS } from "@/config/links";
import { school, cohortLabel } from "@/config/school";
import { INSIDE } from "@/config/school-page";
import { DISCORD, getDiscordMemberCount } from "@/lib/discord";

export default async function Academy() {
  const members = await getDiscordMemberCount();
  const spotsLeft =
    members === null ? null : Math.max(DISCORD.freeSpots - members, 0);
  const fmt = (n: number) => n.toLocaleString("en-US");
  /* the home page is static: the cohort line is checked at build time */
  const cohort = cohortLabel();

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
              every Droppable campaign, from your first render to your first
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
              <span className="launch-bar">
                <span className="launch-bar-label">Open</span>
              </span>
              <span className="tier">
                Skool — <b>The full system</b>
              </span>
              <h3>The Droppable Method</h3>
              <p className="path-lede">From 0 to hero in generative AI.</p>
              <ul>
                {/* the same list as "What's inside" on /school; its first
                    line already carries the lesson count */}
                {INSIDE.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="school-price">
                <span className="now">{school.priceMonthly}</span>
                <span className="then">/month · cancel anytime</span>
              </p>
              {cohort && (
                <p className="school-cohort">
                  Next 7-Day Challenge: <b>{cohort}</b>
                </p>
              )}
              <Link className="btn" href={LINKS.school}>
                See the school <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

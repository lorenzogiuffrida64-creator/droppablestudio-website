import Link from "next/link";
import { LINKS } from "@/config/links";

const WORDMARK = "Droppable";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-cols">
          <div>
            <h4 className="serif">Studio</h4>
            <a href="#work">Work</a>
            <a href="#why">Why AI</a>
            <Link href={LINKS.inquiry}>Start a project</Link>
          </div>
          <div>
            <h4 className="serif">Academy</h4>
            <a href={LINKS.discord} target="_blank" rel="noopener">
              Discord — free
            </a>
            <a href={LINKS.skool} target="_blank" rel="noopener">
              Skool community
            </a>
          </div>
          <div>
            <h4 className="serif">Social</h4>
            <a href={LINKS.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
            <a href={LINKS.tiktok} target="_blank" rel="noopener">
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* giant lockup — full-bleed; king is always visible, boings on scroll-into-view */}
      <div className="foot-hero rv">
        <img
          className="foot-king"
          src="/logo-sage.png"
          alt=""
          aria-hidden="true"
        />
        <div className="foot-word">{WORDMARK}</div>
      </div>

      <div className="wrap">
        <div className="foot-base">
          <span>© 2026 Droppable Studio · Rendered by AI, directed by humans</span>
          <div className="foot-socials">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
                <circle cx="12" cy="12" r="4.4" />
                <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={LINKS.tiktok}
              target="_blank"
              rel="noopener"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            <a
              href={LINKS.discord}
              target="_blank"
              rel="noopener"
              aria-label="Discord"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
            <a
              href={LINKS.skool}
              target="_blank"
              rel="noopener"
              aria-label="Skool community"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

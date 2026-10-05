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
            <a href="#faq">FAQ</a>
            <Link href={LINKS.inquiry}>Start a project</Link>
          </div>
          <div>
            <h4 className="serif">Academy</h4>
            <a href={LINKS.skool} target="_blank" rel="noopener">
              Skool community
            </a>
          </div>
          <div>
            <h4 className="serif">Social</h4>
            <a href={LINKS.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
            <a href={LINKS.youtube} target="_blank" rel="noopener">
              YouTube
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
              href={LINKS.youtube}
              target="_blank"
              rel="noopener"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.9a3.02 3.02 0 0 0-2.12-2.14C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.9C0 8.79 0 12 0 12s0 3.21.5 5.1a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.21 24 12 24 12s0-3.21-.5-5.1zM9.6 15.57V8.43L15.82 12 9.6 15.57z" />
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

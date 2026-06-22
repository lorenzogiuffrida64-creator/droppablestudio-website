"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LINKS } from "@/config/links";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <a href="#top" className="brand">
        <img src="/logo-blue.png" alt="Droppable Studio logo" />
        <span className="brand-name">Droppable&nbsp;Studio</span>
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="#work">Work</a>
        <a href="#why">Why AI</a>
        <a href="#academy">Academy</a>
      </nav>
      <Link className="btn" href={LINKS.inquiry}>
        Start a project
      </Link>
    </header>
  );
}

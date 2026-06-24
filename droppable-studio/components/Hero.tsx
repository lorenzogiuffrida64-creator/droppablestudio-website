"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LINKS } from "@/config/links";

const PHRASES = [
  "freeze.",
  "convert.",
  "go viral.",
  "stand out.",
  "sell.",
];

const TYPE_SPEED = 72;   // ms per character typed
const DELETE_SPEED = 38; // ms per character deleted
const PAUSE_AFTER = 1800; // ms to hold the full phrase
const PAUSE_BEFORE = 320; // ms pause before typing next

export default function Hero() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion.current) {
      setDisplayed(PHRASES[0]);
      return;
    }
  }, []);

  useEffect(() => {
    if (reduceMotion.current) return;

    const phrase = PHRASES[phraseIdx];

    if (isPaused) {
      const t = setTimeout(() => setIsPaused(false), PAUSE_AFTER);
      return () => clearTimeout(t);
    }

    if (!isDeleting && displayed === phrase) {
      // full phrase typed — pause then start deleting
      setIsPaused(true);
      setIsDeleting(true);
      return;
    }

    if (isDeleting && displayed === "") {
      // fully deleted — brief pause then move to next phrase
      const t = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
      }, PAUSE_BEFORE);
      return () => clearTimeout(t);
    }

    const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    const t = setTimeout(() => {
      setDisplayed(
        isDeleting ? phrase.slice(0, displayed.length - 1) : phrase.slice(0, displayed.length + 1)
      );
    }, delay);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, isPaused, phraseIdx]);

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="eyebrow rv">AI marketing agency — worldwide</p>
        <h1 className="rv d1">
          We make the internet{" "}
          <em>
            {displayed}
            <span className="type-cursor" aria-hidden="true" />
          </em>
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

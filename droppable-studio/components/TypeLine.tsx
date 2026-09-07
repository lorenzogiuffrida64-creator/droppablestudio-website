"use client";

import { useEffect, useRef, useState } from "react";

/* The studio's typing line — types a phrase, holds it, deletes it, moves on.
   Renders only the animated <em>; the sentence around it belongs to the caller,
   so the home hero and the /portfolio stage read identically.
   Under prefers-reduced-motion it prints the first phrase and stops. */

export const HERO_PHRASES = [
  "freeze.",
  "convert.",
  "go viral.",
  "stand out.",
  "sell.",
];

const TYPE_SPEED = 72;    // ms per character typed
const DELETE_SPEED = 38;  // ms per character deleted
const PAUSE_AFTER = 1800; // ms to hold the full phrase
const PAUSE_BEFORE = 320; // ms pause before typing next

export default function TypeLine({
  phrases = HERO_PHRASES,
}: {
  phrases?: string[];
}) {
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
      setDisplayed(phrases[0]);
      return;
    }
  }, [phrases]);

  useEffect(() => {
    if (reduceMotion.current) return;

    const phrase = phrases[phraseIdx];

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
        setPhraseIdx((i) => (i + 1) % phrases.length);
      }, PAUSE_BEFORE);
      return () => clearTimeout(t);
    }

    const delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;
    const t = setTimeout(() => {
      setDisplayed(
        isDeleting
          ? phrase.slice(0, displayed.length - 1)
          : phrase.slice(0, displayed.length + 1)
      );
    }, delay);
    return () => clearTimeout(t);
  }, [displayed, isDeleting, isPaused, phraseIdx, phrases]);

  return (
    <em>
      {displayed}
      <span className="type-cursor" aria-hidden="true" />
    </em>
  );
}

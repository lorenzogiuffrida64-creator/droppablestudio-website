/**
 * Client testimonials for the looping carousel (see components/Testimonials.tsx).
 * To publish a real testimonial:
 *   1. (Optional) drop a square headshot in /public/testimonials/  (e.g. lumen.jpg)
 *   2. Add an entry below; set `avatar` to its path, or omit it to show initials.
 * Keep quotes short and specific — they read as part of the design, not filler.
 * The values below are PLACEHOLDERS to be replaced with real client words.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string; // e.g. "Founder, Lumen Skincare"
  avatar?: string; // optional, e.g. "/testimonials/lumen.jpg"; falls back to initials
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "They turned a single product shot into a full campaign that actually stopped people mid-scroll. Our save rate doubled in a week.",
    name: "Elena Marchetti",
    role: "Founder, Lumen Skincare",
  },
  {
    quote:
      "First agency that gets premium. The ads felt like a fashion film, not a template — and they shipped the whole set in 72 hours.",
    name: "Marcus Lindqvist",
    role: "Creative Director, Atelier Nord",
  },
  {
    quote:
      "We listed the penthouse with their reel and had three serious offers before the open house. The work speaks for itself.",
    name: "Priya Raman",
    role: "Partner, Halcyon Estates",
  },
  {
    quote:
      "Every hook variation tested better than what our in-house team made all quarter. The volume and the taste level are unreal.",
    name: "David Okonkwo",
    role: "Head of Growth, Verve Audio",
  },
  {
    quote:
      "I came in skeptical about AI ads. I left with the best-performing launch we've ever run. Droppable is a different tier.",
    name: "Sofia Bianchi",
    role: "CMO, Mirellå Fragrance",
  },
  {
    quote:
      "Fast, tasteful, and zero hand-holding. They understood the brand from the first call and the feed has never looked better.",
    name: "James Whitfield",
    role: "Owner, The Meridian Hotel",
  },
];

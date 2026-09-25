/**
 * FAQ — the objections a premium lead raises before they inquire, answered
 * in advance (see components/Faq.tsx). Ordered by how often they block a
 * booking: quality doubt first, then money, time, control, risk, fit.
 * Keep answers short and specific — two or three sentences, no filler.
 */
export type FaqItem = {
  q: string;
  a: string;
};

export const FAQ: FaqItem[] = [
  {
    q: "Will it look like AI?",
    a: "No. Every frame is art-directed and finished by hand — lighting, skin, fabric, product. If it reads as “AI”, it doesn’t ship. Generating is easy; taste is the job.",
  },
  {
    q: "Will our product look exactly like our product?",
    a: "Yes. We build from your real packshots, so labels, colours and textures stay true. The product is the one thing we never reinvent.",
  },
  {
    q: "How much does a campaign cost?",
    a: "A fixed price, agreed before we start — no day rates, no crew, no reshoots. It scales with scope, so tell us what you need and we’ll come back with an exact number.",
  },
  {
    q: "Is it really 72 hours?",
    a: "For a standard campaign, yes — counted from an approved brief. Larger productions get a fixed delivery date before work begins, and we hold it.",
  },
  {
    q: "What if we don’t like the first cut?",
    a: "You sign off on the direction before we render, and review the cut before delivery. Revisions are part of the process, not an upsell.",
  },
  {
    q: "Who owns the ads?",
    a: "You do. Full commercial rights to every final asset — paid, organic, print, out-of-home.",
  },
  {
    q: "How much of our time does it take?",
    a: "One call to brief us, then approvals at each milestone. No shoot days, no casting, no studio to book.",
  },
  {
    q: "Are we the right fit?",
    a: "We work with premium brands in skincare, fashion, real estate, music and enterprise. If we’re not the right studio for you, we’ll say so on the first call.",
  },
];

# CLAUDE.md — Droppable Studio Website

This file is the project's source of truth. Read it before making any change.

## What this project is
Official website for **Droppable Studio** (Instagram: @droppablestudio), an AI marketing
agency creating high-end, scroll-stopping AI ads for premium brands (skincare, fashion,
real estate, music industry, enterprise). NOT for small/low-budget brands.

The site is a dual funnel:
1. **Agency funnel**: Hero → industries marquee → manifesto → portfolio → Why AI → inquiry CTA (external form)
2. **Value/education funnel**: Academy section → Discord (free, trust-builder) → Skool (paid community, main education conversion)

Tone: premium, tasteful, confident, minimal — "classic artist" energy, never salesy or cluttered.

## Brand system (NEVER deviate)
- **Colors** (only these two + derived shades):
  - `#355070` blu — dark surfaces, primary text on sage
  - `#cfd7c7` verde chiaro / sage — light surfaces, text on blu
  - Derived (already in use): `#243A52` blu-deep (footer), `#1B2C40` blu-ink (darkest text),
    `#5F7187` muted (secondary text on sage), `#9FB0A6` muted-light (secondary text on blu),
    `#EAF0E3` sage-bright (highlights on blu)
  - No other accent colors. No violet, no neon, no gradients outside these hues.
- **Typography**:
  - Primary: **SF Pro Text Bold**, letter-spacing −40 (−0.04em). Web stack:
    `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif` (Inter = cross-platform fallback)
  - Secondary: **Apple Garamond Italic** (web equivalent: **EB Garamond Italic**), used for
    accent words in headlines, manifesto lede, campaign titles, "Why AI" claims
- **Logo**: liquid/melting chess king mark. Assets: `logo-blue.png` (for sage backgrounds),
  `logo-sage.png` (for blu backgrounds). Currently base64-inlined in the HTML — extract to
  `/public` during migration.

## Signature element (protect at all costs)
A 3D liquid drop (Three.js r128, `MeshMatcapMaterial` with a procedurally generated
blue/sage matcap, displaced icosahedron) that travels a choreographed path down the page
as the user scrolls — beside the hero headline, left at the manifesto, dives under the
dark band, resurfaces HUGE behind the inquiry CTA, then accompanies the Academy section.
Waypoints live in the `KEYS` array in the inline script. This is the brand's "stop-scroll"
moment; do not remove or simplify it.

## Page structure (order = the funnel, do not reorder)
1. Nav (fixed, blurs on scroll) — logo + Work / Why AI / Academy + "Start a project"
2. Hero — "We make the internet *stop scrolling.*"
3. Industries marquee (Skincare, Fashion, Real Estate, Music…)
4. 01 / The studio — manifesto
5. Dark band (blu, rounded corners top/bottom):
   - 02 / The work — 6 portfolio tiles, 4:5 ratio (IG format), placeholder gradients to be
     replaced with real campaign reels (`<video autoplay muted loop playsinline>`)
   - 03 / Why AI — ledger rows: Budget (−60%), Speed (72h), Re-hook (∞ hook variations)
6. Inquiry CTA — "Your brand, in the feed, *by next week.*" → external form
7. 04 / The Academy — two cards: Discord (free, ghost button) + Skool (featured, solid button)
8. Footer (blu-deep) — serif-headed link columns, then a giant brand lockup (chess-king
   mark + static "Droppable" wordmark): on scroll-into-view the king drops in with a
   cartoon squash-and-stretch bounce (static under `prefers-reduced-motion`),
   then base bar (©, social icons)

## Links
- Instagram (final): https://www.instagram.com/droppablestudio?igsh=MXBmYmkyeGNzb3QzeQ%3D%3D&utm_source=qr
- Inquiry form: https://app.youform.com/forms/t7epdczh
- Discord: https://discord.gg/rs5eATyJ7W
- Skool: https://www.skool.com/droppablestudio-ai-school-7941/about

## Engineering rules
- Accessibility floor: visible keyboard focus, `prefers-reduced-motion` fully respected
  (static drop, no marquee/reveal animations), semantic HTML, alt text on real media.
- Performance: drop geometry detail 4 on mobile / 5 on desktop, pixel ratio capped at 2,
  IntersectionObserver for reveals. Keep Lighthouse ≥ 90 on mobile.
- All scroll/hover animation uses transform + opacity only (no layout-thrashing properties).
- Copy is part of the design: short, confident, specific. No filler marketing-speak.

## Migration target (when converting from static HTML)
- Next.js (App Router) + React, components split as:
  `Nav, Hero, Marquee, Manifesto, WorkGrid, WorkTile, WhyLedger, InquiryCta, Academy, Footer, DropCanvas`
- `DropCanvas` is a client component (`"use client"`), Three.js via npm package,
  rendered once at layout level (it's a fixed full-screen canvas shared by all sections).
- Brand tokens → CSS variables in `globals.css` (copy the `:root` block verbatim).
- Fonts via `next/font/google` (Inter + EB Garamond); keep the SF Pro system stack first.
- Logo PNGs and future reels → `/public`.
- Centralize external URLs in one `config/links.ts` file.

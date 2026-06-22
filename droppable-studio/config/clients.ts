/**
 * Client logo wall — the scrolling strip under the hero
 * ("Brands we've worked with").
 *
 * Each logo is rendered as a flat single-tint blu (#355070) SILHOUETTE via a CSS
 * mask (see `.marquee-logo` in globals.css), so any source logo — SVG or raster,
 * any colors — is normalized to one on-brand style automatically.
 *
 * To add a brand: drop its logo in /public/logos (SVG preferred, PNG ok — it MUST
 * have a transparent background, or it masks to a solid block) and add an entry
 * below. Only real, authorized clients belong here.
 */
export type Client = {
  name: string; // accessible label, e.g. "Wearvybes"
  logo: string; // path under /public, e.g. "/logos/wearvybes.svg"
  width?: number; // px — override the default cell width for unusually wide/narrow marks
};

// width = aspect-ratio × 26px row height, so every mark renders at the same
// optical height. Square icons get a small minimum so they don't look cramped.
export const CLIENTS: Client[] = [
  { name: "InVideo", logo: "/logos/invideo.svg", width: 135 },
  { name: "House of Garments", logo: "/logos/houseofgarments.png", width: 140 },
  { name: "Vemue", logo: "/logos/vemueclo.png", width: 66 },
  { name: "Blueprint", logo: "/logos/blueprint.png", width: 153 },
  { name: "Skygen", logo: "/logos/skygen.svg", width: 30 },
  { name: "Magnesium", logo: "/logos/magnesium.svg", width: 41 },
  { name: "Freelifeco", logo: "/logos/freelifeco.png", width: 40 },
  { name: "Looblet", logo: "/logos/looblet.png", width: 125 },
  { name: "Wearvybes", logo: "/logos/wearvybes.png", width: 28 },
];

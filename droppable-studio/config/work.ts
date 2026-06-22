/**
 * Reel cards for the looping work carousel.
 * Videos live in /public/reels/ as muted, web-optimized 9:16 MP4s
 * (720×1280, audio stripped; landscape sources are letterboxed with black bars).
 * The carousel autoplays muted loops; clicking a card opens the full reel.
 *
 * brand / category / adId / duration / platform / ctr are display chips —
 * edit them freely. To add a reel: drop a 9:16 mp4 in /public/reels and
 * point `video` at it.
 */
/**
 * Cache-busting token appended to every reel URL (?v=N). Bump this whenever you
 * re-encode a file in /public/reels so browsers fetch the new version instead of
 * replaying a stale copy from their media cache.
 */
export const REELS_VERSION = 4;

export type WorkItem = {
  ph: 1 | 2 | 3 | 4 | 5 | 6; // placeholder gradient if a video is ever missing
  brand: string; // top-left chip
  category: string; // industry — shown in the reel lightbox
  adId: string; // bottom-left chip
  duration: string; // bottom-right chip
  platform: string; // distribution channel
  ctr: string; // performance figure
  video?: string;
};

export const WORK: WorkItem[] = [
  { ph: 1, brand: "Rolex",        category: "Luxury",      adId: "AD-001", duration: "0:27", platform: "Meta",     ctr: "+268%", video: "/reels/rolex.mp4" },
  { ph: 2, brand: "Wearvybes",    category: "Fashion",     adId: "AD-204", duration: "0:12", platform: "IG Reels", ctr: "+241%", video: "/reels/wearvybes.mp4" },
  { ph: 3, brand: "Blueprint",    category: "Design",      adId: "AD-178", duration: "0:14", platform: "YouTube",  ctr: "+198%", video: "/reels/blueprint.mp4" },
  { ph: 4, brand: "Freelico",     category: "Tech",        adId: "AD-304", duration: "0:12", platform: "TikTok",   ctr: "+221%", video: "/reels/freelico.mp4" },
  { ph: 5, brand: "Looblet",      category: "Lifestyle",   adId: "AD-716", duration: "0:15", platform: "IG Reels", ctr: "+204%", video: "/reels/looblet.mp4" },
  { ph: 6, brand: "Droppable",    category: "Branding",    adId: "AD-000", duration: "0:10", platform: "Meta",     ctr: "+312%", video: "/reels/logo-concept.mp4" },
  { ph: 1, brand: "Lumen",        category: "Skincare",    adId: "AD-310", duration: "0:09", platform: "IG Reels", ctr: "+189%", video: "/reels/reel-0310.mp4" },
  { ph: 2, brand: "Halcyon",      category: "Real Estate", adId: "AD-427", duration: "0:10", platform: "YouTube",  ctr: "+176%", video: "/reels/reel-0427.mp4" },
  { ph: 3, brand: "Verona",       category: "Music",       adId: "AD-507", duration: "0:10", platform: "Meta",     ctr: "+233%", video: "/reels/reel-0507.mp4" },
  { ph: 4, brand: "Meridian",     category: "Hospitality", adId: "AD-516", duration: "0:08", platform: "TikTok",   ctr: "+158%", video: "/reels/reel-0516.mp4" },
  { ph: 5, brand: "Atelier Nord", category: "Fashion",     adId: "AD-616", duration: "0:08", platform: "IG Reels", ctr: "+212%", video: "/reels/reel-0616.mp4" },
  { ph: 6, brand: "Aurelia",      category: "Beauty",      adId: "AD-901", duration: "0:17", platform: "IG Reels", ctr: "+227%", video: "/reels/reel-fbc9.mp4" },
  { ph: 1, brand: "Cascade",      category: "Travel",      adId: "AD-902", duration: "0:25", platform: "YouTube",  ctr: "+183%", video: "/reels/reel-1754.mp4" },
];

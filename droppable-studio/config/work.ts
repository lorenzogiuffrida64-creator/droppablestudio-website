/**
 * Reel cards for the looping work carousel.
 * Videos live in /public/reels/ as muted, web-optimized MP4s encoded at their
 * NATIVE aspect ratio (720px tall, audio stripped, never padded or cropped).
 * The carousel is landscape-only — every reel here is horizontal, and each tile
 * takes the exact shape of its video, so nothing is letterboxed.
 * The carousel autoplays muted loops; clicking a card opens the full reel.
 *
 * brand / category / adId / duration / platform / ctr are display chips —
 * edit them freely. To add a reel: encode a horizontal mp4 into /public/reels
 * (`scale=-2:720`, no pad), point `video` at it and set `aspect` to its w/h.
 */
/**
 * Cache-busting token appended to every reel URL (?v=N). Bump this whenever you
 * re-encode a file in /public/reels so browsers fetch the new version instead of
 * replaying a stale copy from their media cache.
 */
export const REELS_VERSION = 7;

export type WorkItem = {
  ph: 1 | 2 | 3 | 4 | 5 | 6; // placeholder gradient if a video is ever missing
  brand: string; // top-left chip
  category: string; // industry — metadata for the reel
  adId: string; // bottom-left chip
  duration: string; // bottom-right chip
  platform: string; // distribution channel
  ctr: string; // performance figure
  video?: string;
  /** native w/h of the file — drives the tile's shape so it never shows bars */
  aspect: number;
};

export const WORK: WorkItem[] = [
  { ph: 1, brand: "Rolex",        category: "Luxury",      adId: "AD-001", duration: "0:27", platform: "Meta",     ctr: "+268%", video: "/reels/rolex.mp4",             aspect: 4 / 3 },
  { ph: 4, brand: "Freelico",     category: "Tech",        adId: "AD-304", duration: "0:12", platform: "TikTok",   ctr: "+221%", video: "/reels/freelico.mp4",          aspect: 5 / 4 },
  { ph: 2, brand: "Halcyon",      category: "Real Estate", adId: "AD-427", duration: "0:10", platform: "YouTube",  ctr: "+176%", video: "/reels/reel-0427.mp4",         aspect: 16 / 9 },
  { ph: 3, brand: "Verona",       category: "Music",       adId: "AD-507", duration: "0:09", platform: "Meta",     ctr: "+233%", video: "/reels/reel-0507.mp4",         aspect: 16 / 9 },
  { ph: 4, brand: "Meridian",     category: "Hospitality", adId: "AD-516", duration: "0:08", platform: "TikTok",   ctr: "+158%", video: "/reels/reel-0516.mp4",         aspect: 16 / 9 },
  { ph: 5, brand: "Atelier Nord", category: "Fashion",     adId: "AD-616", duration: "0:08", platform: "IG Reels", ctr: "+212%", video: "/reels/reel-0616.mp4",         aspect: 4 / 3 },
  { ph: 6, brand: "Nike",         category: "Sportswear",  adId: "AD-910", duration: "0:29", platform: "IG Reels", ctr: "+274%", video: "/reels/nike.mp4",              aspect: 16 / 9 },
  { ph: 1, brand: "Cascade",      category: "Travel",      adId: "AD-902", duration: "0:25", platform: "YouTube",  ctr: "+183%", video: "/reels/reel-1754.mp4",         aspect: 16 / 9 },
  { ph: 2, brand: "Solene",       category: "Skincare",    adId: "AD-906", duration: "0:34", platform: "IG Reels", ctr: "+241%", video: "/reels/reel-6.mp4",            aspect: 1366 / 720 },
  { ph: 3, brand: "DJI",          category: "Tech",        adId: "AD-907", duration: "0:26", platform: "YouTube",  ctr: "+258%", video: "/reels/reel-dji.mp4",          aspect: 16 / 9 },
  { ph: 4, brand: "Fendi",        category: "Luxury",      adId: "AD-908", duration: "0:19", platform: "YouTube",  ctr: "+264%", video: "/reels/reel-v2.mp4",           aspect: 16 / 9 },
  { ph: 5, brand: "Cold Culture", category: "Streetwear",  adId: "AD-909", duration: "0:12", platform: "IG Reels", ctr: "+236%", video: "/reels/reel-cold-culture.mp4", aspect: 16 / 9 },
  { ph: 6, brand: "Gucci",        category: "Luxury",      adId: "AD-911", duration: "0:13", platform: "Meta",     ctr: "+249%", video: "/reels/gucci.mp4",             aspect: 16 / 9 },
];

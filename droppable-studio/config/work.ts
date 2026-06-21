/**
 * Portfolio tiles. To publish a reel:
 *   1. Drop the file in /public/reels/  (mp4 or webm, 9:16 or 16:9 — both work)
 *   2. Set `video` to its path, e.g. video: "/reels/glass-skin-ritual.mp4"
 * Tiles without a video show the brand placeholder gradient and link to Instagram.
 * Previews are cover-cropped to the 4:5 feed tile; the lightbox plays the
 * native aspect ratio.
 */
export type WorkItem = {
  ph: 1 | 2 | 3 | 4 | 5 | 6; // placeholder gradient when no video yet
  category: string;
  title: string;
  video?: string;
};

export const WORK: WorkItem[] = [
  { ph: 1, category: "Skincare", title: "Glass Skin Ritual", video: "/reels/test-portrait.webm" },
  { ph: 2, category: "Fashion", title: "Chrome Season", video: "/reels/test-landscape.webm" },
  { ph: 3, category: "Real Estate", title: "The Penthouse Cut", video: "/reels/test-penthouse.webm" },
  { ph: 4, category: "Music", title: "Tour Visualizer", video: "/reels/test-tour.webm" },
  { ph: 5, category: "Hospitality", title: "Golden Hour Suites", video: "/reels/test-suites.webm" },
  { ph: 6, category: "Enterprise", title: "Launch Sequence", video: "/reels/test-launch.webm" },
];

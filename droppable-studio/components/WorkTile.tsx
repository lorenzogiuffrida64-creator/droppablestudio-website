import type { CSSProperties } from "react";
import { REELS_VERSION, type WorkItem } from "@/config/work";

type WorkTileProps = {
  item: WorkItem;
  hidden?: boolean; // the loop's duplicate copy — hidden from a11y
};

export default function WorkTile({ item, hidden }: WorkTileProps) {
  return (
    // --ar is the video's native w/h; the tile is sized from it so the file
    // fills the frame exactly — no letterbox bars, no crop.
    <div
      className="reel"
      aria-hidden={hidden || undefined}
      style={{ "--ar": item.aspect } as CSSProperties}
    >
      <span className="reel-frame">
        {item.video ? (
          <video
            className="reel-media"
            src={`${item.video}?v=${REELS_VERSION}`}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : (
          <span className={`reel-media ph ph-${item.ph}`} aria-hidden="true" />
        )}
        <span className="reel-live">
          <i aria-hidden="true" />
          Live
        </span>
      </span>
    </div>
  );
}

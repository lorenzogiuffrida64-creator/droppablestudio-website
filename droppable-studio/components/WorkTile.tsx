import { REELS_VERSION, type WorkItem } from "@/config/work";

type WorkTileProps = {
  item: WorkItem;
  hidden?: boolean; // the loop's duplicate copy — hidden from a11y, not focusable
  onOpen: (item: WorkItem) => void;
};

export default function WorkTile({ item, hidden, onOpen }: WorkTileProps) {
  return (
    <button
      type="button"
      className="reel"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      onClick={() => onOpen(item)}
      aria-label={`Play reel: ${item.brand} — ${item.category}`}
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
    </button>
  );
}

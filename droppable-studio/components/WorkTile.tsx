import { LINKS } from "@/config/links";
import type { WorkItem } from "@/config/work";

type WorkTileProps = {
  item: WorkItem;
  delay?: 1 | 2;
  onOpen: (item: WorkItem) => void;
};

export default function WorkTile({ item, delay, onOpen }: WorkTileProps) {
  const cls = `tile rv${delay ? ` d${delay}` : ""}`;
  const meta = (
    <div className="tile-meta">
      <div>
        <small>{item.category}</small>
        <h3>{item.title}</h3>
      </div>
      <span className="tile-view">
        {item.video ? "Play reel" : "View campaign"}
      </span>
    </div>
  );

  if (item.video) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => onOpen(item)}
        aria-label={`Play reel: ${item.title} (${item.category})`}
      >
        {/* cover-cropped feed preview — full aspect ratio plays in the lightbox */}
        <video
          className="tile-media"
          src={item.video}
          muted
          loop
          playsInline
          preload="metadata"
        />
        {meta}
      </button>
    );
  }

  return (
    <a className={cls} href={LINKS.instagram} target="_blank" rel="noopener">
      <div className={`tile-media ph ph-${item.ph}`}></div>
      {meta}
    </a>
  );
}

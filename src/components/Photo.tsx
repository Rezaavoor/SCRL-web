import type { PhotoItem } from "../types";

export function Photo({ item }: { item: PhotoItem }) {
  return (
    <img
      src={item.src}
      draggable={false}
      style={{
        position: "absolute",
        left: item.x - item.width / 2,
        top: item.y - item.height / 2,
        width: item.width,
        height: item.height,
        maxWidth: "none",
        transform: `rotate(${item.rotation}rad)`,
        transformOrigin: "center",
      }}
    />
  );
}

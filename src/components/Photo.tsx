import { useAtom } from "jotai";
import type { PhotoItem } from "../types";
import { selectedIdAtom } from "../state/atoms";

export function Photo({ item }: { item: PhotoItem }) {
  const [selectedId, setSelectedId] = useAtom(selectedIdAtom);
  const selected = item.id === selectedId;

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedId(item.id);
  };

  return (
    <img
      src={item.src}
      draggable={false}
      onPointerDown={onPointerDown}
      style={{
        position: "absolute",
        left: item.x - item.width / 2,
        top: item.y - item.height / 2,
        width: item.width,
        height: item.height,
        maxWidth: "none",
        outline: selected ? "2px solid #3b82f6" : "none",
        transform: `rotate(${item.rotation}rad)`,
        transformOrigin: "center",
      }}
    />
  );
}

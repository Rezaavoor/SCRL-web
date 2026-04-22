import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import type { PhotoItem, Vec2 } from "../types";
import { itemsAtom, selectedIdAtom, viewportAtom } from "../state/atoms";

export function Photo({ item }: { item: PhotoItem }) {
  const [selectedId, setSelectedId] = useAtom(selectedIdAtom);
  const setItems = useSetAtom(itemsAtom);
  const { zoom } = useAtomValue(viewportAtom);
  const lastPointer = useRef<Vec2 | null>(null);
  const selected = item.id === selectedId;

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedId(item.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!lastPointer.current) return;
    // Screen deltas divided by zoom = world-space deltas.
    const dx = (e.clientX - lastPointer.current.x) / zoom;
    const dy = (e.clientY - lastPointer.current.y) / zoom;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setItems((items) =>
      items.map((it) =>
        it.id === item.id ? { ...it, x: it.x + dx, y: it.y + dy } : it,
      ),
    );
  };

  const onPointerUp = () => {
    lastPointer.current = null;
  };

  return (
    <img
      src={item.src}
      draggable={false}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        left: item.x - item.width / 2,
        top: item.y - item.height / 2,
        width: item.width,
        height: item.height,
        maxWidth: "none",
        outline: selected ? `${2 / zoom}px solid #3b82f6` : "none", // outline width based on the zoom
        cursor: "move",
        transform: `rotate(${item.rotation}rad)`,
        transformOrigin: "center",
      }}
    />
  );
}

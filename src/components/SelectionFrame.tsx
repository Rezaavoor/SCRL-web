import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import { itemsAtom, selectedIdAtom, viewportAtom } from "../state/atoms";
import type { PhotoItem, Vec2 } from "../types";

const HANDLE_PX = 10; // size of the handle in pixels
const MIN_SIZE = 10; // minimum size of the item in pixels

export function SelectionFrame() {
  const selectedId = useAtomValue(selectedIdAtom);
  const items = useAtomValue(itemsAtom);
  const setItems = useSetAtom(itemsAtom);
  const { zoom } = useAtomValue(viewportAtom);
  const snap = useRef<{ start: Vec2; item: PhotoItem } | null>(null); // track the start position and the item

  const item = items.find((i) => i.id === selectedId);
  if (!item) return null; // if no item is selected, show nothing

  const handleSize = HANDLE_PX / zoom;
  const hx = item.x + item.width / 2; // bottom right corner
  const hy = item.y + item.height / 2; // bottom right corner

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    snap.current = { start: { x: e.clientX, y: e.clientY }, item };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!snap.current) return;
    const dx = (e.clientX - snap.current.start.x) / zoom;
    const dy = (e.clientY - snap.current.start.y) / zoom;
    const width = Math.max(MIN_SIZE, snap.current.item.width + 2 * dx); // new width based on the delta
    const height = Math.max(MIN_SIZE, snap.current.item.height + 2 * dy); // new height based on the delta
    setItems((all) =>
      all.map((it) => (it.id === item.id ? { ...it, width, height } : it)), // update the item with the new width and height
    );
  };

  const onPointerUp = () => {
    snap.current = null;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        left: hx - handleSize / 2,
        top: hy - handleSize / 2,
        width: handleSize,
        height: handleSize,
        background: "#3b82f6",
        cursor: "nwse-resize",
      }}
    />
  );
}

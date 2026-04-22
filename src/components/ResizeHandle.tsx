import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import { itemsAtom, viewportAtom } from "../state/atoms";
import { worldFromLocal } from "../lib/geometry";
import type { PhotoItem, Vec2 } from "../types";

const HANDLE_PX = 10; // size of the handle in pixels
const MIN_SIZE = 10; // minimum size of the item in pixels

export function ResizeHandle({ item }: { item: PhotoItem }) {
  const setItems = useSetAtom(itemsAtom);
  const { zoom } = useAtomValue(viewportAtom);
  const snap = useRef<{ start: Vec2; item: PhotoItem } | null>(null);

  const handleSize = HANDLE_PX / zoom;

  const { x: hx, y: hy } = worldFromLocal(item, {
    x: -item.width / 2,
    y: -item.height / 2,
  }); // top left corner wrt the photo's rotation

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    snap.current = { start: { x: e.clientX, y: e.clientY }, item };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!snap.current) return;
    const { start, item: startItem } = snap.current;
    const dx = (e.clientX - start.x) / zoom;
    const dy = (e.clientY - start.y) / zoom;
    // Rotate world delta into photo's local frame, then symmetric scale.
    const c = Math.cos(startItem.rotation);
    const s = Math.sin(startItem.rotation);
    const localDx = c * dx + s * dy;
    const localDy = -s * dx + c * dy;
    const width = Math.max(MIN_SIZE, startItem.width - 2 * localDx); // new width based on the delta in the photo's rotation
    const height = Math.max(MIN_SIZE, startItem.height - 2 * localDy); // new height based on the delta in the photo's rotation
    setItems((all) =>
      all.map((it) => (it.id === item.id ? { ...it, width, height } : it)),
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

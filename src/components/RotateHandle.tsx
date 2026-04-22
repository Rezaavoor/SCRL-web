import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import { itemsAtom, viewportAtom } from "../state/atoms";
import { worldFromLocal } from "../lib/geometry";
import type { PhotoItem } from "../types";

const HANDLE_PX = 10;
const GAP_PX = 20;

type Snap = { startAngle: number; initialRotation: number };

export function RotateHandle({ item }: { item: PhotoItem }) {
  const setItems = useSetAtom(itemsAtom);
  const { zoom, panX, panY } = useAtomValue(viewportAtom);
  const snap = useRef<Snap | null>(null);

  const handleSize = HANDLE_PX / zoom;
  const { x: hx, y: hy } = worldFromLocal(item, {
    x: 0,
    y: -item.height / 2 - GAP_PX / zoom,
  }); // above the top edge wrt the photo's rotation

  // Pointer angle around the photo's center, in client coords.
  // Assumes the viewport is at page (0,0) — true for this app's layout.
  const angleFromCenter = (clientX: number, clientY: number) => {
    const cx = panX + item.x * zoom;
    const cy = panY + item.y * zoom;
    return Math.atan2(clientY - cy, clientX - cx);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    snap.current = {
      startAngle: angleFromCenter(e.clientX, e.clientY),
      initialRotation: item.rotation,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!snap.current) return;
    const angle = angleFromCenter(e.clientX, e.clientY);
    const rotation = snap.current.initialRotation + (angle - snap.current.startAngle);
    setItems((all) =>
      all.map((it) => (it.id === item.id ? { ...it, rotation } : it)),
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
        borderRadius: "50%",
        cursor: "grab",
      }}
    />
  );
}

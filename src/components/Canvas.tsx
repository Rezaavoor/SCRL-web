import { useAtom } from "jotai";
import { useRef } from "react";
import { viewportAtom } from "../state/atoms";

type DragStart = { x: number; y: number; panX: number; panY: number };

export function Canvas() {
  const [viewport, setViewport] = useAtom(viewportAtom);
  const dragStart = useRef<DragStart | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.target !== e.currentTarget) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      panX: viewport.panX,
      panY: viewport.panY,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const { x, y, panX, panY } = dragStart.current;
    setViewport((v) => ({
      ...v,
      panX: panX + (e.clientX - x),
      panY: panY + (e.clientY - y),
    }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragStart.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        backgroundImage:
          "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.panX}px ${viewport.panY}px`,
      }}
    />
  );
}

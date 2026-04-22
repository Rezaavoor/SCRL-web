import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { itemsAtom, viewportAtom } from "../state/atoms";
import { zoomAt } from "../lib/geometry";
import type { Vec2 } from "../types";
import { Photo } from "./Photo";

export function Canvas() {
  const [viewport, setViewport] = useAtom(viewportAtom);
  const items = useAtomValue(itemsAtom);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<Vec2 | null>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // no default behaviour

      const rect = el.getBoundingClientRect(); // Position and size of the viewport on the page.
      const cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }; // convert cursor to viewport-local coordinates
      const factor = Math.exp(-e.deltaY * 0.0015); // zoom factor based on the wheel delta
      setViewport((v) => zoomAt(v, cursor, v.zoom * factor)); // apply the new zoom
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [setViewport]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.target !== e.currentTarget) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!lastPointer.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setViewport((v) => ({ ...v, panX: v.panX + dx, panY: v.panY + dy }));
  };

  const onPointerUp = () => {
    lastPointer.current = null;
  };

  return (
    <div
      ref={viewportRef}
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
    >
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {items.map((item) => (
          <Photo key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

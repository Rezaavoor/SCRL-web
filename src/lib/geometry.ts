import type { Vec2, Viewport } from "../types";

export function screenToWorld(p: Vec2, v: Viewport): Vec2 {
  return {
    x: (p.x - v.panX) / v.zoom,
    y: (p.y - v.panY) / v.zoom,
  };
}

export function zoomAt(v: Viewport, cursor: Vec2, nextZoom: number): Viewport {
  const zoom = Math.min(10, Math.max(0.1, nextZoom));
  const world = screenToWorld(cursor, v);
  return {
    zoom,
    panX: cursor.x - world.x * zoom,
    panY: cursor.y - world.y * zoom,
  };
}

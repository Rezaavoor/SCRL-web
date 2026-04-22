import type { Vec2, Viewport } from "../types";

export function screenToWorld(p: Vec2, v: Viewport): Vec2 {
  return {
    x: (p.x - v.panX) / v.zoom,
    y: (p.y - v.panY) / v.zoom,
  };
}

// Transform a point from a photo's local frame (origin at its center, rotated
// by item.rotation) to world coordinates. Used to place selection handles.
export function worldFromLocal(
  item: { x: number; y: number; rotation: number },
  local: Vec2,
): Vec2 {
  const cos = Math.cos(item.rotation);
  const sin = Math.sin(item.rotation);
  return {
    x: item.x + local.x * cos - local.y * sin,
    y: item.y + local.x * sin + local.y * cos,
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

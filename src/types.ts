export type Vec2 = { x: number; y: number };

export type Viewport = {
  panX: number;
  panY: number;
  zoom: number;
};

export type PhotoItem = {
  id: string;
  src: string;
  x: number; // world-space center
  y: number;
  width: number;
  height: number;
  rotation: number; // radians
};

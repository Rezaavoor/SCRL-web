import type { PhotoItem, Vec2 } from "../types";

const MAX_SIDE = 400;

export async function createPhotoFromFile(
  file: File,
  center: Vec2,
): Promise<PhotoItem> {
  const src = URL.createObjectURL(file);
  const { naturalWidth: w, naturalHeight: h } = await loadImage(src);
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  return {
    id: crypto.randomUUID(),
    src,
    x: center.x,
    y: center.y,
    width: w * scale,
    height: h * scale,
    rotation: 0,
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

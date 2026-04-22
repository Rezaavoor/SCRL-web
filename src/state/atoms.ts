import { atom } from "jotai";
import type { PhotoItem, Viewport } from "../types";

export const viewportAtom = atom<Viewport>({ panX: 0, panY: 0, zoom: 1 });
export const itemsAtom = atom<PhotoItem[]>([]);

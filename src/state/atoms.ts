import { atom } from "jotai";
import type { Viewport } from "../types";

export const viewportAtom = atom<Viewport>({ panX: 0, panY: 0, zoom: 1 });

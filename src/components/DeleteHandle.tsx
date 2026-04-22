import { useAtomValue, useSetAtom } from "jotai";
import { itemsAtom, selectedIdAtom, viewportAtom } from "../state/atoms";
import { worldFromLocal } from "../lib/geometry";
import type { PhotoItem } from "../types";

export function DeleteHandle({ item }: { item: PhotoItem }) {
  const setItems = useSetAtom(itemsAtom);
  const setSelectedId = useSetAtom(selectedIdAtom);
  const { zoom } = useAtomValue(viewportAtom);
  const items = useAtomValue(itemsAtom);

  const size = 22 / zoom;
  const gap = 10 / zoom;

  const { x: hx, y: hy } = worldFromLocal(item, {
    x: item.width / 2 + gap,
    y: -item.height / 2 - gap,
  }); // just outside the top-right corner wrt the photo's rotation

  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setItems((all) => all.filter((it) => it.id !== item.id)); // delete the item
    setSelectedId(items[items.length - 2]?.id ?? null); // select the previous item
  };

  return (
    <div
      onPointerDown={onPointerDown}
      title="Delete"
      style={{
        position: "absolute",
        left: hx - size / 2,
        top: hy - size / 2,
        width: size,
        height: size,
        background: "white",
        borderRadius: "50%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="60%"
        height="60%"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M6 6l1 14h10l1-14" />
      </svg>
    </div>
  );
}

import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import { itemsAtom, viewportAtom } from "../state/atoms";
import { createPhotoFromFile } from "../lib/photo";
import { screenToWorld } from "../lib/geometry";

export function Toolbar() {
  const viewport = useAtomValue(viewportAtom);
  const setItems = useSetAtom(itemsAtom);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const center = screenToWorld(
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      viewport,
    );
    const photo = await createPhotoFromFile(file, center);
    setItems((items) => [...items, photo]);
    e.target.value = "";
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={() => inputRef.current?.click()}
        className="px-3 py-2 bg-white shadow rounded border border-neutral-300 hover:bg-neutral-50 cursor-pointer"
      >
        Add photo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
}

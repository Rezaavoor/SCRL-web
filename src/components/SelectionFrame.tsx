import { useAtomValue } from "jotai";
import { itemsAtom, selectedIdAtom } from "../state/atoms";
import { ResizeHandle } from "./ResizeHandle";
import { RotateHandle } from "./RotateHandle";

export function SelectionFrame() {
  const selectedId = useAtomValue(selectedIdAtom);
  const items = useAtomValue(itemsAtom);
  const item = items.find((i) => i.id === selectedId);
  if (!item) return null;

  return (
    <>
      <ResizeHandle item={item} />
      <RotateHandle item={item} />
    </>
  );
}

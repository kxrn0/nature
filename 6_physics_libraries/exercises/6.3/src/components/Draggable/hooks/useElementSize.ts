import { createStore } from "solid-js/store";
import { Point } from "../../../types";

export function useElementSize() {
  const [handleSize, setHandleSize] = createStore({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = createStore({
    width: 0,
    height: 0,
  });
  const [parentOffset, setParentOffset] = createStore({ x: 0, y: 0 });

  function update_sizes(container: Element, handle: Element) {
    const cRect = container.getBoundingClientRect();
    const hRect = handle.getBoundingClientRect();

    setHandleSize({ width: hRect.width, height: hRect.height });
    setContainerSize({ width: cRect.width, height: cRect.height });
    setParentOffset({ x: hRect.x - cRect.x, y: hRect.y - cRect.y });
  }

  function keep_in_viewport(
    setPosition: (position: Point) => void,
    position: { x: number; y: number }
  ) {
    const x = Math.max(
      0,
      Math.min(position.x, innerWidth - containerSize.width)
    );
    const y = Math.max(
      0,
      Math.min(position.y, innerHeight - containerSize.height)
    );

    setPosition({ x, y });
  }

  return {
    handleSize,
    containerSize,
    parentOffset,
    update_sizes,
    keep_in_viewport,
  };
}

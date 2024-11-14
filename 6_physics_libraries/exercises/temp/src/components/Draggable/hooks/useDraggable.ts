import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Point } from "../../../types";

export function useDraggable(initialPosition: Point) {
  const [position, setPosition] = createStore({
    x: initialPosition.x,
    y: initialPosition.y,
  });
  const [dragOffset, setDragOffset] = createStore({ x: 0, y: 0 });
  const [isBeingDragged, setIsBeingDragged] = createSignal(false);

  function start_drag(event: MouseEvent, parentOffset: Point) {
    const point = { x: event.clientX, y: event.clientY };
    const offset = {
      x: point.x - position.x - parentOffset.x,
      y: point.y - position.y - parentOffset.y,
    };

    setIsBeingDragged(true);
    setDragOffset(offset);
  }

  function update_position(
    event: MouseEvent,
    parentOffset: Point,
    containerSize: { width: number; height: number }
  ) {
    if (!isBeingDragged()) return;

    const client = { x: event.clientX, y: event.clientY };
    const parentCorner = {
      x: client.x - dragOffset.x - parentOffset.x,
      y: client.y - dragOffset.y - parentOffset.y,
    };

    const x = Math.min(
      window.innerWidth - containerSize.width,
      Math.max(0, parentCorner.x)
    );
    const y = Math.min(
      window.innerHeight - containerSize.height,
      Math.max(0, parentCorner.y)
    );

    setPosition({ x, y });
  }

  const stop_drag = () => setIsBeingDragged(false);

  return {
    position,
    setPosition,
    start_drag,
    update_position,
    stop_drag,
  };
}

import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useDraggable } from "./hooks/useDraggable";
import { useElementSize } from "./hooks/useElementSize";
import { Point } from "../../types";
import is_point_in_rect from "../../utils/geometry/is_point_in_rect";
import styles from "./Draggable.module.scss";

type Props = {
  initialPosition: Point;
  includeHandle: boolean;
  children: any;
};

export default function Draggable(props: Props) {
  const [zIndex, setZIndex] = createSignal(0);
  const { position, setPosition, start_drag, update_position, stop_drag } =
    useDraggable(props.initialPosition);
  const {
    handleSize,
    containerSize,
    parentOffset,
    update_sizes,
    keep_in_viewport,
  } = useElementSize();
  const observer = new ResizeObserver(() => {
    const handle = handleRef ? handleRef : container.querySelector(".handle");

    if (!handle) throw new Error("no handle!");

    update_sizes(container, handle);
    keep_in_viewport(setPosition, position);
  });
  let container!: HTMLDivElement;
  let handleRef!: HTMLDivElement;

  function zee() {
    const draggables: HTMLDivElement[] = Array.from(
      document.querySelectorAll(`.${styles["draggable"]}`)
    );
    const highest = draggables.reduce(
      (highest: number, current: HTMLDivElement) => {
        const index = Number(current.style.zIndex);

        if (index > highest) highest = index;

        return highest;
      },
      0
    );

    setZIndex(highest + 1);
  }

  function handle_mouse_down(event: MouseEvent) {
    const point = { x: event.clientX, y: event.clientY };
    const box = {
      corner: {
        x: position.x + parentOffset.x,
        y: position.y + parentOffset.y,
      },
      width: handleSize.width,
      height: handleSize.height,
    };

    if (is_point_in_rect(point, box)) {
      event.preventDefault();

      zee();

      start_drag(event, parentOffset);
    }
  }

  function handle_mouse_move(event: MouseEvent) {
    update_position(event, parentOffset, containerSize);
  }

  onMount(() => {
    observer.observe(container);
  });

  onMount(() => {
    window.addEventListener("mousedown", handle_mouse_down);
    window.addEventListener("mousemove", handle_mouse_move);
    window.addEventListener("mouseup", stop_drag);
  });

  onCleanup(() => {
    observer.disconnect();

    window.removeEventListener("mousedown", handle_mouse_down);
    window.removeEventListener("mousemove", handle_mouse_move);
    window.removeEventListener("mouseup", stop_drag);
  });

  return (
    <div
      class={styles["draggable"]}
      style={`--x: ${position.x}px; --y: ${position.y}px; z-index: ${zIndex()}`}
      ref={container}
    >
      <Show when={props.includeHandle}>
        <div class="handle" ref={handleRef}></div>
      </Show>
      {props.children}
    </div>
  );
}

import { createSignal, onCleanup, onMount } from "solid-js";
import Matter from "matter-js";
import stroke_path from "../../utils/drawing/stroke_path";
import fill_circle from "../../utils/drawing/fill_circle";
import fill_path from "../../utils/drawing/fill_path";
import Draggable from "../Draggable/Draggable";
import styles from "./Factory.module.scss";
import useDrawingState, { STATES, SNAP_RADIUS } from "./hooks/useDrawingState";

const COLORS = { VALID: "greenyellow", INVALID: "lightcoral" };

type Props = {
  add_shape: (vertices: Matter.Vector[]) => void;
};

export default function Factory(props: Props) {
  const [isOpen, setIsOpen] = createSignal(true);
  const {
    vertices,
    isClose,
    isValid,
    mouse,
    state,
    reset,
    update_mouse,
    handle_mouse_move,
    handle_click,
  } = useDrawingState();

  const [animeId, setAnimeId] = createSignal(-1);
  let canvas!: HTMLCanvasElement;

  function toggle_canvas() {
    setIsOpen((prev) => !prev);
  }

  function add_shape() {
    props.add_shape(vertices());

    reset();
  }

  onMount(() => {
    const context = canvas.getContext("2d")!;

    if (!context) throw new Error("no context error!");

    function anime() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (state() === STATES.BUILDING) {
        if (vertices().length)
          stroke_path(context, [...vertices(), mouse], "lightgray", 1, false);

        for (let vertex of vertices()) fill_circle(context, vertex, 5, "gray");

        if (isClose())
          fill_circle(
            context,
            vertices()[0],
            SNAP_RADIUS,
            "rgb(100, 255, 200, .25)"
          );
      } else if (state() === STATES.READY) {
        fill_path(
          context,
          vertices(),
          isValid() ? COLORS.VALID : COLORS.INVALID
        );
      }

      setAnimeId(requestAnimationFrame(anime));
    }

    function init() {
      setAnimeId(requestAnimationFrame(anime));
    }

    init();
  });

  onMount(() => {
    canvas.addEventListener("mousemove", handle_mouse_move);

    canvas.addEventListener("click", handle_click);

    window.addEventListener("mousemove", update_mouse);
  });

  onCleanup(() => {
    cancelAnimationFrame(animeId());

    window.removeEventListener("mousemove", update_mouse);
    canvas.removeEventListener("mousemove", handle_mouse_move);
    canvas.removeEventListener("click", handle_click);
  });

  return (
    <Draggable
      initialPosition={{ x: innerWidth - 350, y: 50 }}
      includeHandle={false}
    >
      <div class={styles["factory"]}>
        <div class={styles["nav"]}>
          <button
            onClick={add_shape}
            disabled={state() !== STATES.READY && !isValid()}
          >
            add shape
          </button>
          <div class={`handle ${styles["handle"]}`}></div>
          <button onClick={reset}>clear</button>
          <button onClick={toggle_canvas}>{isOpen() ? "close" : "open"}</button>
        </div>
        <canvas
          width={300}
          height={300}
          ref={canvas}
          class={styles["canvas"]}
          classList={{ [styles["open"]]: isOpen() }}
        ></canvas>
      </div>
    </Draggable>
  );
}

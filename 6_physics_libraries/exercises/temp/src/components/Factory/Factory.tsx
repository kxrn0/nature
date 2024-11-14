import { createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import Matter from "matter-js";
import stroke_path from "../../utils/drawing/stroke_path";
import fill_circle from "../../utils/drawing/fill_circle";
import fill_path from "../../utils/drawing/fill_path";
import is_point_in_circle from "../../utils/geometry/is_point_in_circle";
import is_convex from "../../utils/geometry/is_convex";
import get_reordered from "../../utils/geometry/get_reordered";
import Draggable from "../Draggable/Draggable";
import styles from "./Factory.module.scss";

type Props = {
  add_shape: (vertices: Matter.Vector[]) => void;
};

const STATES = { IDLE: "IDLE", BUILDING: "BUILDING", READY: "READY" };
const COLORS = { VALID: "greenyellow", INVALID: "lightcoral" };
const SNAP_RADIUS = 20;

export default function Factory(props: Props) {
  const [isOpen, setIsOpen] = createSignal(true);
  const [vertices, setVertices] = createSignal<Matter.Vector[]>([]);
  const [isClose, setIsClose] = createSignal(false);
  const [isValid, setIsValid] = createSignal(false);
  const [mouse, setMouse] = createStore(Matter.Vector.create(0, 0));
  const [state, setState] = createSignal(STATES.IDLE);
  const [animeId, setAnimeId] = createSignal(-1);
  let canvas!: HTMLCanvasElement;

  function toggle_canvas() {
    setIsOpen((prev) => !prev);
  }

  function reset() {
    setVertices([]);
    setIsClose(false);
    setIsValid(false);
    setState(STATES.IDLE);
  }

  function add_shape() {
    props.add_shape(vertices());

    reset();
  }

  function update_mouse(event: MouseEvent) {
    const mouse = { x: event.offsetX, y: event.offsetY };

    setMouse(mouse);
  }

  function handle_mouse_move() {
    if (state() !== STATES.BUILDING) return;

    const point = mouse;
    const center = vertices()[0];
    const radius = SNAP_RADIUS;
    const isClose =
      vertices().length > 2 && is_point_in_circle(point, center, radius);

    setIsClose(isClose);
  }

  function handle_click(event: MouseEvent) {
    if (state() === STATES.READY) return;

    const vertex = Matter.Vector.create(event.offsetX, event.offsetY);
    const center = vertices()[0];
    const radius = SNAP_RADIUS;
    const canCreate =
      center &&
      vertices().length > 2 &&
      is_point_in_circle(vertex, center, radius);

    if (canCreate) {
      const isValid = is_convex(vertices());

      if (isValid) {
        const reordered = get_reordered(vertices());

        setVertices(reordered);
      }

      setIsValid(isValid);
      setState(STATES.READY);
    } else {
      setVertices((prev) => [...prev, vertex]);
      setState(STATES.BUILDING);
    }
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

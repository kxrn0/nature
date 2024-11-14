import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import Matter from "matter-js";
import is_point_in_circle from "../../../utils/geometry/is_point_in_circle";
import is_convex from "../../../utils/geometry/is_convex";
import get_reordered from "../../../utils/geometry/get_reordered";

export const STATES = { IDLE: "IDLE", BUILDING: "BUILDING", READY: "READY" };
export const SNAP_RADIUS = 20;

export default function useDrawingState() {
  const [vertices, setVertices] = createSignal<Matter.Vector[]>([]);
  const [isClose, setIsClose] = createSignal(false);
  const [isValid, setIsValid] = createSignal(false);
  const [mouse, setMouse] = createStore(Matter.Vector.create(0, 0));
  const [state, setState] = createSignal(STATES.IDLE);

  function reset() {
    setVertices([]);
    setIsClose(false);
    setIsValid(false);
    setState(STATES.IDLE);
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

  return {
    vertices,
    isClose,
    isValid,
    mouse,
    state,
    reset,
    update_mouse,
    handle_mouse_move,
    handle_click,
  };
}

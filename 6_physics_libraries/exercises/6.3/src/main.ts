import Matter from "matter-js";
import is_point_in_rect from "./utils/geometry/is_point_in_rect";
import is_point_in_circle from "./utils/geometry/is_point_in_circle";
import fill_circle from "./utils/drawing/fill_circle";
import stroke_path from "./utils/drawing/stroke_path";
import fill_path from "./utils/drawing/fill_path";
import is_convex from "./utils/geometry/is_convex";
import reorder from "./utils/geometry/reorder";
import "./style.css";

const mainCanvas = document.querySelector("#main-canvas") as HTMLCanvasElement;
const mainContext = mainCanvas.getContext("2d")!;
const drawContainer = document.querySelector(
  ".draw-container"
) as HTMLDivElement;
const drawCanvas = drawContainer.querySelector(
  "#drawing-canvas"
) as HTMLCanvasElement;
const drawContext = drawCanvas.getContext("2d")!;
const drawStuff = {
  vertices: [] as Matter.Vector[],
  isClose: false,
  fillStyle: "lightcoral",
  mouse: Matter.Vector.create(0, 0),
  reset: function () {
    this.vertices = [];
    this.state = this.STATES.IDLE;
    this.isClose = false;
  },
  state: "IDLE",
  STATES: { IDLE: "IDLE", BUILDING: "BUILDING", READY: "READY" },
  COLORS: { VALID: "greenyellow", INVALID: "lightcoral" },
};

const shapes: Matter.Vector[] = [];
const polygons = [];

function anime() {
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

  if (drawStuff.state === drawStuff.STATES.BUILDING) {
    if (drawStuff.vertices.length >= 1)
      stroke_path(
        drawContext,
        [...drawStuff.vertices, drawStuff.mouse],
        "lightgray",
        1,
        false
      );

    for (let vertex of drawStuff.vertices)
      fill_circle(drawContext, vertex, 5, "gray");

    if (drawStuff.isClose)
      fill_circle(
        drawContext,
        drawStuff.vertices[0],
        20,
        "rgb(100, 255, 200, .25)"
      );
  } else if (drawStuff.state === drawStuff.STATES.READY) {
    fill_path(drawContext, drawStuff.vertices, drawStuff.fillStyle);
  }

  requestAnimationFrame(anime);
}

function set_up_drag_functionality() {
  const drawRekt = drawContainer.getBoundingClientRect();
  const handle = drawContainer.querySelector(".handle")!;
  const handleRekt = handle.getBoundingClientRect();
  const box = {
    corner: Matter.Vector.create(handleRekt.x, handleRekt.y),
    width: handleRekt.width,
    height: handleRekt.height,
    parentOffset: Matter.Vector.create(
      handleRekt.x - drawRekt.x,
      handleRekt.y - drawRekt.y
    ),
    parentWidth: drawRekt.width,
    parentHeight: drawRekt.height,
    dragOffset: Matter.Vector.create(0, 0),
    isBeingDragged: false,
    element: drawContainer,
  };

  window.addEventListener("mousedown", (event) => {
    const point = Matter.Vector.create(event.clientX, event.clientY);

    if (is_point_in_rect(point, box)) {
      event.preventDefault();

      box.isBeingDragged = true;
      Matter.Vector.sub(point, box.corner, box.dragOffset);
    }
  });

  window.addEventListener("mousemove", (event) => {
    if (!box.isBeingDragged) return;

    const client = Matter.Vector.create(event.clientX, event.clientY);
    const p = Matter.Vector.sub(
      client,
      Matter.Vector.add(box.dragOffset, box.parentOffset)
    );
    const xf = Math.min(innerWidth - box.parentWidth, Math.max(0, p.x));
    const yf = Math.min(innerHeight - box.parentHeight, Math.max(0, p.y));
    const f = Matter.Vector.create(xf, yf);
    const v = Matter.Vector.add(f, box.parentOffset);

    box.corner = v;
    box.element.style.setProperty("--x", `${xf}px`);
    box.element.style.setProperty("--y", `${yf}px`);
  });

  window.addEventListener("mouseup", () => (box.isBeingDragged = false));
}

function set_up_draw_functionality() {
  const resetButton = drawContainer.querySelector(".reset-button")!;

  resetButton.addEventListener("click", () => drawStuff.reset());

  drawCanvas.addEventListener("mousemove", () => {
    if (drawStuff.state !== drawStuff.STATES.BUILDING) return;

    const point = drawStuff.mouse;
    const center = drawStuff.vertices[0];
    const radius = 10;

    drawStuff.isClose =
      drawStuff.vertices.length > 2 &&
      is_point_in_circle(point, center, radius);
  });

  drawCanvas.addEventListener("click", (event) => {
    if (drawStuff.state === drawStuff.STATES.READY) return;

    const vertex = Matter.Vector.create(event.offsetX, event.offsetY);
    const center = drawStuff.vertices[0];
    const radius = 10;
    const create =
      center &&
      drawStuff.vertices.length > 2 &&
      is_point_in_circle(vertex, center, radius);

    if (create) {
      const isValid = is_convex(drawStuff.vertices);

      if (isValid) {
        drawStuff.fillStyle = drawStuff.COLORS.VALID;

        reorder(drawStuff.vertices);
      } else drawStuff.fillStyle = drawStuff.COLORS.INVALID;

      drawStuff.state = drawStuff.STATES.READY;
    } else {
      drawStuff.state = drawStuff.STATES.BUILDING;
      drawStuff.vertices.push(vertex);
    }
  });
}

function set_up_toggle() {
  const label = drawContainer.querySelector(".toggle-label")!;
  const span = label.querySelector("span") as HTMLSpanElement;
  const input = label.querySelector(
    "input[type='checkbox']"
  ) as HTMLInputElement;

  input.addEventListener("change", () => {
    const text = input.checked ? "open" : "close";

    span.innerText = text;
    drawCanvas.classList.toggle("hidden");
  });
}

function set_up_draw_stuff() {
  window.addEventListener("mousemove", (event) => {
    drawStuff.mouse.x = event.offsetX;
    drawStuff.mouse.y = event.offsetY;
  });

  set_up_drag_functionality();
  set_up_toggle();
  set_up_draw_functionality();
}

function init() {
  mainCanvas.width = innerWidth;
  mainCanvas.height = innerHeight;

  set_up_draw_stuff();

  requestAnimationFrame(anime);
}

init();

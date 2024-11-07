import Matter from "matter-js";
import is_point_in_rect from "./utils/is_point_in_rect";
import "./style.css";

const mainCanvas = document.querySelector("#main-canvas") as HTMLCanvasElement;
const mainContext = mainCanvas.getContext("2d")!;
const drawCanvas = document.querySelector(
  "#drawing-canvas"
) as HTMLCanvasElement;
const drawContext = drawCanvas.getContext("2d")!;
const drawStuff = {
  vertices: [] as Matter.Vector[],
  isBuilding: false,
  isClose: false,
  mouse: Matter.Vector.create(0, 0),
};
const polygons = [];

function anime() {
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

  requestAnimationFrame(anime);
}

function init_draw_canvas() {
  const drawContainer = document.querySelector(".container") as HTMLDivElement;
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

  window.addEventListener("mousemove", (event) => {
    drawStuff.mouse.x = event.offsetX;
    drawStuff.mouse.y = event.offsetY;
  });

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

function init() {
  mainCanvas.width = innerWidth;
  mainCanvas.height = innerHeight;

  init_draw_canvas();

  requestAnimationFrame(anime);
}

init();

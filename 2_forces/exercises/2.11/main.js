import Mover from "./Mover";
import Vector from "./Vector";
import Attractor from "./Attractor";
import random_rgb from "./random_rgb";
import are_colliding from "./are_colliding";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const controls = document.querySelector(".controls");
const movers = [];
const TRACTOR_COLORS = { IDLE: "#fe93b9", HOVERED: "#fe35z57" };
const MODES = { ADDING: "ADDING", DRAGGING: "DRAGGING" };
const mouse = new Vector(0, 0);
let tractor, isDraggingTractor, mode, moverRadius;

function draw_mark() {
  if (mode === MODES.DRAGGING) return;

  context.beginPath();
  context.strokeStyle = "black";
  context.arc(mouse.x, mouse.y, moverRadius, 0, Math.PI * 2);
  context.stroke();
}

function init_controls() {
  const addRadio = controls.querySelector("#add");
  const moveRadio = controls.querySelector("#move");
  const range = controls.querySelector("#range");

  window.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );

  addRadio.addEventListener("change", () => {
    if (addRadio.checked) {
      mode = MODES.ADDING;
      isDraggingTractor = false;
    } else mode = MODES.DRAGGING;
  });

  moveRadio.addEventListener("change", () => {
    if (moveRadio.checked) mode = MODES.DRAGGING;
    else mode = MODES.ADDING;
  });

  range.addEventListener("input", () => (moverRadius = Number(range.value)));

  canvas.addEventListener("click", () => {
    if (mode === MODES.DRAGGING) return;

    const position = mouse.copy();
    const velocity = new Vector(0, 0);
    const color = random_rgb();
    const mover = new Mover(canvas, position, velocity, moverRadius, color);

    movers.push(mover);
  });

  canvas.addEventListener("mousedown", (event) => {
    if (mode === MODES.ADDING) return;

    const point = { position: mouse, radius: 0 };

    if (are_colliding(point, tractor)) isDraggingTractor = true;
  });

  canvas.addEventListener("mouseup", () => (isDraggingTractor = false));

  canvas.addEventListener("mousemove", () => {
    if (isDraggingTractor) tractor.position = mouse.copy();
  });

  canvas.addEventListener("mousemove", () => {
    if (mode === MODES.ADDING) return;

    const point = { position: mouse, radius: 0 };

    if (are_colliding(point, tractor)) tractor.color = TRACTOR_COLORS.HOVERED;
    else tractor.color = TRACTOR_COLORS.IDLE;
  });
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let mover of movers) {
    tractor.attract(mover);

    mover.move();
    mover.draw();
  }

  tractor.draw();

  if (mode === MODES.ADDING) draw_mark();

  requestAnimationFrame(anime);
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const tractorPosition = new Vector(width / 2, height / 2);
  const tractorRadius = 10;
  const tractorColor = TRACTOR_COLORS.IDLE;

  init_controls();

  tractor = new Attractor(
    context,
    tractorPosition,
    tractorRadius,
    tractorColor
  );
  isDraggingTractor = false;
  mode = MODES.ADDING;
  moverRadius = 10;
  mouse.set(width / 2, height / 2);

  canvas.width = width;
  canvas.height = height;

  requestAnimationFrame(anime);
}

init();

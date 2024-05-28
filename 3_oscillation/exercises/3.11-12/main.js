import Curve from "./Curve";
import Vector from "./Vector";
import are_intersecting from "./are_intersecting";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const curves = [];
const MODES = { MOVING: "moving_curves", ADDING: "adding_curves" };
const amplitude = 50;
const da = 0.1;
const dx = 1;
const mouse = new Vector(innerWidth / 2, innerHeight / 2);
let addPoint;
let movePoint;
let mode = MODES.ADDING;

function add_curve() {
  if (addPoint) {
    const curve = new Curve(addPoint, mouse, amplitude, da, dx);

    curves.push(curve);
    addPoint = null;
  } else {
    addPoint = mouse.clone();
  }
}

function move_curve() {
  if (movePoint) movePoint = null;
  else {
    const user = { radius: 0, center: mouse };

    for (let curve of curves) {
      const a = { radius: 5, center: curve.start };
      const b = { radius: 5, center: curve.end };

      if (are_intersecting(user, a)) return (movePoint = curve.start);

      if (are_intersecting(user, b)) return (movePoint = curve.end);
    }
  }
}

function draw_line() {
  if (mode === MODES.ADDING && addPoint) {
    context.beginPath();
    context.moveTo(addPoint.x, addPoint.y);
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
  }
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let curve of curves) curve.draw(context);

  draw_line();

  requestAnimationFrame(anime);
}

function init() {
  const form = document.querySelector("form");
  const plusRadio = form.querySelector("#plus");
  const moveRadio = form.querySelector("#move");

  plusRadio.addEventListener("change", () => {
    mode = MODES.ADDING;

    movePoint = null;
  });

  moveRadio.addEventListener("change", () => {
    mode = MODES.MOVING;

    addPoint = null;
  });

  canvas.addEventListener("click", () => {
    if (mode === MODES.ADDING) add_curve();
    else move_curve();
  });

  window.addEventListener("mousemove", (event) => {
    mouse.set(event.clientX, event.clientY);

    if (movePoint) movePoint.copy(mouse);
  });

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  addPoint = null;
  movePoint = null;

  requestAnimationFrame(anime);
}

init();

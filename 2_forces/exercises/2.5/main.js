import Vector from "./Vector";
import Mover from "./Mover";
import force_mover from "./force_mover";
import random from "./random";
import random_rgb from "./random_rgb";
import "reset-css";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const movers = [];
const mouse = new Vector(0, 0);
let isAdding, isForcing;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let mover of movers) {
    if (isForcing) force_mover(mover, mouse, 1, -5);

    mover.check_edges();
    mover.move();
    mover.draw();
  }

  if (isForcing) {
    context.beginPath();
    context.fillStyle = "#fe127699";
    context.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
    context.fill();
  }

  requestAnimationFrame(anime);
}

function init_controls() {
  const controls = document.querySelector("fieldset");
  const addMoverRadio = controls.querySelector("#me");
  const applyForceRadio = controls.querySelector("#you");

  addMoverRadio.addEventListener(
    "change",
    () => (isAdding = addMoverRadio.checked)
  );

  applyForceRadio.addEventListener(
    "change",
    () => (isAdding = !applyForceRadio.checked)
  );

  canvas.addEventListener("click", (event) => {
    if (!isAdding) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;
    const position = new Vector(x, y);
    const vMag = 5;
    const velocity = new Vector(random(-vMag, vMag), random(-vMag, vMag));
    const mass = random(1, 25);
    const radius = mass * 3;
    const color = random_rgb();
    const mover = new Mover(canvas, position, velocity, mass, radius, color);

    movers.push(mover);
  });

  canvas.addEventListener("mousedown", () => (isForcing = !isAdding));

  canvas.addEventListener("mouseup", () => (isForcing = false));

  canvas.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );

  isAdding = true;
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  isForcing = false;

  init_controls();

  requestAnimationFrame(anime);
}

init();

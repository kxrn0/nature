import Attractor from "./Attractor";
import Mover from "./Mover";
import Vector from "./Vector";
import random from "./random";
import "./style.css";
import "reset-css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const controls = document.querySelector(".controls");
const radios = controls.querySelector(".radios");
const moverRadio = radios.querySelector("#mover");
const attractorRadio = radios.querySelector("#attractor");
const movers = [];
const tractors = [];
let prevTime, mode, entity;

function anime(timestamp) {
  const dt = Math.min((timestamp - prevTime) / 1000, 0.1);

  prevTime = timestamp;

  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let mover of movers) {
    for (let tractor of tractors) tractor.attract(mover, dt);

    mover.move(dt);
  }

  for (let tractor of tractors) {
    tractor.draw();
  }

  for (let mover of movers) {
    mover.draw();
  }

  requestAnimationFrame(anime);
}

function init() {
  prevTime = 0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mode = "adding";
  entity = "mover";

  requestAnimationFrame(anime);
}

canvas.addEventListener("click", (event) => {
  const position = new Vector(event.clientX, event.clientY);

  if (entity === "mover") {
    const velocity = new Vector(0, 0);
    const radius = 25;
    const color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(
      0,
      255
    )})`;
    const mover = new Mover(canvas, position, velocity, radius, color);

    movers.push(mover);
  } else {
    const force = 10000;
    const radius = 10;
    const color = "#111122";
    const tractor = new Attractor(canvas, position, force, radius, color);

    tractors.push(tractor);
  }
});

moverRadio.addEventListener("change", () => {
  if (moverRadio.checked) entity = "mover";
});

attractorRadio.addEventListener("change", () => {
  if (attractorRadio.checked) entity = "attractor";
});

init();

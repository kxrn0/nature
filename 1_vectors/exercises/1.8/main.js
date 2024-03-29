import Attractor from "./Attractor";
import Mover from "./Mover";
import Vector from "./Vector";
import random from "./random";
import "reset-css";
import "./style.css";
import handle_collision from "./handle_collision";
import collide from "./collide";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const controls = document.querySelector(".controls");
const check = controls.querySelector("#check");
const radios = controls.querySelector(".radios");
const moverRadio = radios.querySelector("#mover");
const attractorRadio = radios.querySelector("#attractor");
const movers = [];
const tractors = [];
let prevTime, isRelocating, currentTractor, entity;

function anime(timestamp) {
  const dt = Math.min((timestamp - prevTime) / 1000, 0.1);

  prevTime = timestamp;

  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < movers.length; i++) {
    for (let tractor of tractors) tractor.attract(movers[i], dt);

    for (let j = i + 1; j < movers.length; j++)
      handle_collision(movers[i], movers[j]);

    movers[i].move(dt);
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
  isRelocating = false;
  currentTractor = null;
  entity = "mover";

  requestAnimationFrame(anime);
}

function add_entity(x, y) {
  const position = new Vector(x, y);

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
    const radius = 5;
    const color = "#111122";
    const tractor = new Attractor(canvas, position, force, radius, color);

    tractors.push(tractor);
  }
}

function set_tractor(x, y) {
  const position = new Vector(x, y);
  const radius = 0;
  const mouse = { radius, position };
  const tractor = tractors.find((tractor) => collide(tractor, mouse));

  currentTractor = tractor;
}

canvas.addEventListener("mousedown", (event) => {
  if (isRelocating) set_tractor(event.clientX, event.clientY);
  else add_entity(event.clientX, event.clientY);
});

canvas.addEventListener("mousemove", (event) => {
  if (!currentTractor) return;

  currentTractor.position.x = event.clientX;
  currentTractor.position.y = event.clientY;
});

canvas.addEventListener("mouseup", () => (currentTractor = null));

check.addEventListener("change", () => {
  if (check.checked) {
    radios.setAttribute("disabled", true);
    isRelocating = true;
  } else {
    radios.removeAttribute("disabled");
    isRelocating = false;
  }
});

moverRadio.addEventListener("change", () => {
  if (moverRadio.checked) entity = "mover";
});

attractorRadio.addEventListener("change", () => {
  if (attractorRadio.checked) entity = "attractor";
});

init();

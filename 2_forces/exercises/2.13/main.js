import Attractor from "./Attractor";
import Mover from "./Mover";
import Vector from "./Vector";
import are_colliding from "./are_colliding";
import random_rgb from "./random_rgb";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const MODES = {
  M: "adding_mover",
  T: "adding_attractor",
  MT: "moving_attractors",
};
const mouse = new Vector(0, 0);
const tractors = [];
const movers = [];
let mode, currentTractor;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const tractor of tractors)
    for (let mover of movers) tractor.attract(mover);

  for (let mover of movers) {
    mover.move();
    mover.draw();
  }

  for (let tractor of tractors) tractor.draw();

  requestAnimationFrame(anime);
}

function init_controls() {
  const addMover = document.querySelector("#add-mover");
  const addTractor = document.querySelector("#add-attractor");
  const moveTractors = document.querySelector("#move-attractors");

  addMover.addEventListener("change", () => {
    mode = MODES.M;

    currentTractor = null;
  });

  addTractor.addEventListener("change", () => {
    mode = MODES.T;

    currentTractor = null;
  });

  moveTractors.addEventListener("change", () => (mode = MODES.MT));

  canvas.addEventListener("mousedown", () => {
    if (mode !== MODES.MT) return;

    const point = { position: mouse, radius: 0 };

    currentTractor = tractors.find((tractor) => are_colliding(tractor, point));
  });

  canvas.addEventListener("mouseup", () => (currentTractor = null));

  canvas.addEventListener("mousemove", () =>
    currentTractor?.position.set(mouse.x, mouse.y)
  );

  canvas.addEventListener("click", () => {
    const position = mouse.copy();
    const radius = 10;
    const color = random_rgb();

    if (mode === MODES.M) {
      const velocity = new Vector(0, 0);
      const mover = new Mover(context, position, velocity, radius, color);

      movers.push(mover);
    } else if (mode === MODES.T) {
      const color = "#00000099";
      const tractor = new Attractor(context, position, radius, color);

      tractors.push(tractor);
    }
  });

  window.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
  mouse.set(width / 2, height / 2);

  init_controls();

  mode = MODES.M;
  currentTractor = null;

  requestAnimationFrame(anime);
}

init();

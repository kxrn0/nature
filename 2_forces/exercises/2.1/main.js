import { createNoise2D } from "simplex-noise";
import Vector from "./Vector";
import Mover from "./Mover";
import map from "./map";
import "reset-css";
import "./style.css";

const noise2d = createNoise2D();
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const movers = [];
let prevTime, t, dt;

function anime(timestamp) {
  const dt = Math.min((timestamp - prevTime) / 1000, 0.1);

  context.clearRect(0, 0, canvas.width, canvas.height);

  const nA = noise2d(t, 0);
  const a = map(nA, -1, 1, 0, 360);
  const nM = noise2d(t + 1e3, 0);
  const m = map(nM, -1, 1, 0.5, 1);
  const wind = Vector.unit_from_angle(a).scale(m);
  const up = new Vector(0, -0.5);

  for (let mover of movers) {
    mover.apply_force(wind);
    mover.apply_force(up);
    mover.update(dt);
  }

  t += dt;

  requestAnimationFrame(anime);
}

function init() {
  prevTime = 0;
  t = 0;
  dt = 0.01;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  requestAnimationFrame(anime);
}

canvas.addEventListener("click", (event) => {
  const position = new Vector(event.clientX, event.clientY);
  const velocity = new Vector(0, 0);
  const radius = 25;
  const color = `purple`;
  const f = 0.9;
  const mover = new Mover(canvas, position, velocity, radius, color, f);

  movers.push(mover);
});

init();

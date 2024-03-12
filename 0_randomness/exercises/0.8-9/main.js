import { createNoise3D } from "simplex-noise";
import draw_perlin from "./draw_perlin";
import "./style.css";

const noise3D = createNoise3D();
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const xIn = document.getElementById("dx");
const yIn = document.getElementById("dy");
const zIn = document.getElementById("dz");
let prevTime, z, dx, dy, dz;

function anime(timestamp) {
  const dt = timestamp - prevTime;

  prevTime = timestamp;

  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_perlin(canvas, noise3D, dx, dy, z);

  z += dz;

  requestAnimationFrame(anime);
}

function init() {
  prevTime = performance.now();
  dx = 0.01;
  dy = 0.01;
  dz = 0.01;
  z = 0;

  requestAnimationFrame(anime);
}

xIn.addEventListener("change", () => (dx = Number(xIn.value)));

yIn.addEventListener("change", () => (dy = Number(yIn.value)));

zIn.addEventListener("change", () => (dz = Number(zIn.value)));

init();

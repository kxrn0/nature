import { createNoise2D, createNoise3D } from "simplex-noise";
import map from "./map";
import random from "./random";
import "./style.css";

const noise2D = createNoise2D();
const noise3D = createNoise3D();
const graph = document.getElementById("graph");
const rnd = document.getElementById("rnd");
const perlin = document.getElementById("perlin");
let prevTime, t;

function draw_random_noise(canvas) {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let x = 0; x < canvas.width; x++)
    for (let y = 0; y < canvas.height; y++) {
      const red = random(0, 255);
      const green = random(0, 255);
      const blue = random(0, 255);
      const index = 4 * (x + y * canvas.width);

      data[index] = red;
      data[index + 1] = green;
      data[index + 2] = blue;
      data[index + 3] = 255;
    }

  context.putImageData(imageData, 0, 0);
}

function draw_graph(canvas, xs, dx) {
  const context = canvas.getContext("2d");
  const x0 = 0;
  const y0 = map(noise2D(x0, 0), -1, 1, 0, canvas.height);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.moveTo(x0, y0);
  for (let x = 1; x < canvas.width; x++) {
    const n = noise2D(xs, 0);
    const y = map(n, -1, 1, 0, canvas.height);

    context.lineTo(x, y);

    xs += dx;
  }
  context.stroke();
}

function draw_perlin_noise(canvas, detail, zs, dz) {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let x = 0; x < canvas.width; x++)
    for (let y = 0; y < canvas.height; y++) {
      const n = noise3D(x * detail, y * detail, zs * detail);
      const shade = map(n, -1, 1, 0, 255);
      const index = 4 * (x + y * canvas.width);

      data[index] = shade;
      data[index + 1] = shade;
      data[index + 2] = shade;
      data[index + 3] = 255;

      zs += dz;
    }

  context.putImageData(imageData, 0, 0);
}

function anime(timestamp) {
  const dt = timestamp - prevTime;

  prevTime = timestamp;

  draw_graph(graph, t, 1e-2);
  draw_random_noise(rnd);
  draw_perlin_noise(perlin, 0.015, t * 50, 0.001);

  t += 1e-3 * dt;

  requestAnimationFrame(anime);
}

function init() {
  prevTime = performance.now();
  t = 0;

  requestAnimationFrame(anime);
}

init();

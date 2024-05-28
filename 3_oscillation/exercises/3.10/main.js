import { createNoise2D } from "simplex-noise";
import "./style.css";
import map from "./map";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const dx = canvas.width / 1000;
const dt = .01;
const dst = .01;
const noise = createNoise2D();
let startTime;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  let time = startTime;
  const y = map(noise(time, -1, 1, 0, canvas.height));

  context.beginPath();
  context.moveTo(0, y);

  for (let x = dx; x <= canvas.width; x += dx) {
    const y = map(noise(time, 0), -1, 1, 0, canvas.height);

    context.lineTo(x, y);

    time += dt;
  }

  context.stroke();

  startTime += dst;

  requestAnimationFrame(anime);
}

function init() {
  startTime = 0;

  requestAnimationFrame(anime); 
}

init();

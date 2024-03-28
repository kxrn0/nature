import { createNoise2D } from "simplex-noise";
import Mover from "./Mover";
import random from "./random";
import draw_perlin from "./draw_perlin";
import map from "./map";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const noise = createNoise2D();
const s = 100;
const movers = [];
const image = document.createElement("img");

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.drawImage(image, 0, 0);

  for (let mover of movers) {
    const position = mover.position;
    const value = noise(position.x / s, position.y / s);
    const angle = map(value, -1, 1, 0, 360);
    const mag = .1;
    const force = { x: mag * Math.cos(angle), y: mag * Math.sin(angle) };

    mover.push(force);
    mover.update();
  }

  requestAnimationFrame(anime);
}

function init() {
  draw_perlin(canvas, context, noise, s);

  const dataurl = canvas.toDataURL();

  image.src = dataurl;

  requestAnimationFrame(anime);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.x;
  const y = event.clientY - rect.y;
  const position = { x, y };
  const radius = 5;
  const fillStyle = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(
    0,
    255
  )})`;
  const mover = new Mover(position, radius, fillStyle, canvas);

  movers.push(mover);
});

init();

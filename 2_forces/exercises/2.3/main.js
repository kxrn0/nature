import Vector from "./Vector";
import random from "./random";
import random_rgb from "./random_rgb";
import Mover from "./Mover";
import check_edges from "./check_edges";
import "reset-css";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const movers = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let mover of movers) {
    check_edges(mover, mover.boundaries, 100, 100);
    mover.move();
    mover.draw();
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.x;
    const y = event.clientY - rect.y;
    const position = new Vector(x, y);
    const vMag = 10;
    const velocity = new Vector(random(-vMag, vMag), random(-vMag, vMag));
    const mass = random(1, 25);
    const radius = mass * 3;
    const color = random_rgb();
    const mover = new Mover(canvas, position, velocity, mass, radius, color);

    movers.push(mover);
  });

  canvas;

  requestAnimationFrame(anime);
}

init();

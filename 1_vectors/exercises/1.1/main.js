import Vector from "./Vector";
import Walker from "./Walker";
import random from "./random";
import "./style.css";

const canvas = document.querySelector("canvas");
const walkers = [];
const stepSize = 1000;
let prevTime;

function anime(timestamp) {
  const dt = (timestamp - prevTime) / 1000;

  prevTime = timestamp;

  for (let walker of walkers) {
    const step = new Vector(
      dt * random(-stepSize, stepSize),
      dt * random(-stepSize, stepSize)
    );

    walker.update(step);
  }

  requestAnimationFrame(anime);
}

function init() {
  prevTime = 0;

  for (let i = 0; i < 100; i++) {
    const position = new Vector(
      random(0, canvas.width),
      random(0, canvas.height)
    );
    const radius = random(1, 5);

    walkers.push(new Walker(canvas, position, radius));
  }

  requestAnimationFrame(anime);
}

init();

import "./style.css";
import Walker from "./walker";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const walkers = [];
let prevTime;

function anime(timestamp) {
  const dt = (timestamp - prevTime) / 1000;

  prevTime = timestamp;

  context.beginPath();
  context.fillStyle = "#defffa11";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let walker of walkers) walker.update(dt);

  requestAnimationFrame(anime);
}

function init() {
  prevTime = performance.now();

  for (let i = 0; i < 500; i++) walkers.push(new Walker(canvas));

  requestAnimationFrame(anime);
}

init();

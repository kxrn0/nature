import Walker from "./Walker";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const walkers = [];
let prevTime;

function anime(timestamp) {
  const dt = timestamp - prevTime;

  prevTime = timestamp;

  context.fillStyle = "#ffffff01";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let walker of walkers) walker.update(dt);

  requestAnimationFrame(anime);
}

function init() {
  prevTime = performance.now();

  requestAnimationFrame(anime);
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.x;
  const y = event.clientY - rect.y;

  for (let i = 0; i < 1000; i++) walkers.push(new Walker(canvas, { x, y }));
});

init();

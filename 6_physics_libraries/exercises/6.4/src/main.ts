import "./style.css";

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  requestAnimationFrame(anime);
}

init();

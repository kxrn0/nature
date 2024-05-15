const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const radius = 5;
const da = .01;
const dd = .05;
let angle, distance;

function anime() {
  const x = distance * Math.cos(angle) + innerWidth / 2;
  const y = distance * Math.sin(angle) + innerHeight / 2;

  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();

  angle += da;
  distance += dd;

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  angle = 0;
  distance = 0;

  requestAnimationFrame(anime);
}

init();

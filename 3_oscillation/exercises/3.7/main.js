const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const anchor = { x: innerWidth / 2, y: innerHeight / 5 };
const position = { x: innerWidth / 2, y: innerHeight / 2 };
const amplitude = 100;
const period = 120;
const radius = 20;
let frameCount, offset;

function draw() {
  context.beginPath();
  context.moveTo(anchor.x, anchor.y);
  context.lineTo(position.x, position.y + offset);
  context.stroke();
  context.beginPath();
  context.arc(position.x, position.y + offset, radius, 0, Math.PI * 2);
  context.fill();
}

function move() {
  offset = amplitude * Math.sin((Math.PI * 2 * frameCount) / period);
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  move();
  draw();

  frameCount++;
  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  frameCount = 0;
  offset = 0;

  requestAnimationFrame(anime);
}

init();

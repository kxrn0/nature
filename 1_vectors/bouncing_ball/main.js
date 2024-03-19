import Ball from "./Ball";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const balls = [];
let prevTime;

function anime(timestamp) {
  const dt = timestamp - prevTime;

  prevTime = timestamp;

  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let ball of balls) ball.update(dt);

  requestAnimationFrame(anime);
}

function init() {
  prevTime = 0;

  for (let i = 0; i < 100; i++) balls.push(new Ball(canvas));

  requestAnimationFrame(anime);
}

init();

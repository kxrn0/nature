import Vector from "./Vector";
import rads_to_degs from "./rads_to_degs";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const range = document.querySelector("input");
const span = document.querySelector("span");
const box = {
  position: new Vector(window.innerWidth / 2, window.innerHeight / 2),
  velocity: new Vector(0, 0),
  width: 300,
  height: 200,
  angle: 0,
  draw: function () {
    const x = -this.width / 2;
    const y = -this.height / 2;

    context.beginPath();
    context.fillStyle = "orange";
    context.translate(this.position.x, this.position.y);
    context.rotate(-this.angle);
    context.fillRect(x, y, this.width, this.height);
    context.setTransform(1, 0, 0, 1, 0, 0);
  },
};

// This is retarded, fuck it. I'll come back to it once I have
// the actual skills to do it.

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  box.draw();

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  range.addEventListener("input", () => {
    const value = Number(range.value);
    const degrees = rads_to_degs(value);

    span.innerText = `angle: ${degrees.toFixed(2)}deg`;
    box.angle = value;
  });

  window.addEventListener("keydown", () => {

  })

  requestAnimationFrame(anime);
}

init();

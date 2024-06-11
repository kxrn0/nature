import create_penduli from "./create_penduli";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = 0.5;
let penduli;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let pen of penduli) {
    pen.move(gravity);
    pen.draw(context);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  penduli = create_penduli(5, Math.PI / 4);

  requestAnimationFrame(anime);
}

init();

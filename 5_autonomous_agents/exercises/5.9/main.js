import draw_vector from "./draw_vector.js";
import Vector from "./Vector.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const pee = document.querySelector("p");
const reference = new Vector(200, 0);
const active = new Vector(0, -200);
const center = new Vector(innerWidth / 2, innerHeight / 2);

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_vector(context, reference, center);
  draw_vector(context, active, center);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("mousemove", (event) => {
    const x = event.offsetX - center.x;
    const y = event.offsetY - center.y;
    const angle = Math.atan2(y, x);
    const str = ((-angle * 180) / Math.PI).toFixed(1);

    active.set_angle(angle);
    pee.innerText = `${str} degrees`;
  });

  requestAnimationFrame(anime);
}

init();

import Liquid from "./Liquid";
import Mover from "./Mover";
import Vector from "./Vector";
import draw_a_box from "./draw_a_box";
import random_color from "./random_color";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const sizeInput = document.querySelector("input");
const mouse = new Vector(0, 0);
const movers = [];
const gravity = new Vector(0, 0.1);
let size, liquid;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let mover of movers) {
    const force = gravity.copy().scale(mover.mass);

    mover.apply_force(force);
    liquid.drag(mover);

    mover.move();
    mover.draw();
  }

  liquid.draw();

  draw_a_box(mouse, context, size);

  requestAnimationFrame(anime);
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const corner = new Vector(0, (3 * height) / 4);

  canvas.width = width;
  canvas.height = height;
  size = 10;
  liquid = new Liquid(context, corner, width, height);

  sizeInput.addEventListener("input", () => (size = Number(sizeInput.value)));

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.clientX, event.clientY);
    const velocity = new Vector(0, 0);
    const mass = size * 5;
    const color = random_color();
    const cd = 1 / size;
    const mover = new Mover(canvas, position, velocity, mass, size, color, cd);

    movers.push(mover);
  });

  window.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );

  requestAnimationFrame(anime);
}

init();

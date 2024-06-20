import Vector from "./Vector";
import create_penduli from "./create_penduli";
import is_point_in_circle from "./is_point_in_circle";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = 0.5;
let penduli, dragged;

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
  penduli = create_penduli(10, Math.PI / 4);
  dragged = null;

  document.addEventListener("mousedown", (event) => {
    const mouse = new Vector(event.clientX, event.clientY);
    const bob = penduli.find((pen) => {
      const circle = { center: pen.bobPosition, radius: pen.bobRadius };

      if (is_point_in_circle(mouse, circle)) return true;
    });

    if (!bob) return;

    bob.isDragging = true;
    dragged = bob;
  });

  document.addEventListener("mousemove", (event) => {
    if (!dragged) return;

    const mouse = new Vector(event.clientX, event.clientY);

    dragged.drag(mouse);
  });

  document.addEventListener("mouseup", () => {
    if (!dragged) return;

    dragged.isDragging = false;
    dragged = null;
  });

  requestAnimationFrame(anime);
}

init();

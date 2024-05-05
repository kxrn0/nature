import Body from "./Body";
import Vector from "./Vector";
import create_polygon from "./create_polygon";
import random from "./random";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const bodies = [];
const mouse = new Vector(0, 0);

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let body of bodies) {
    for (let other of bodies) if (body !== other) body.attract(other);

    body.move();
    body.draw();
  }

  requestAnimationFrame(anime);
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const center = new Vector(width / 2, height / 2);
  const points = create_polygon(5, 1000, center);
  const bds = points.map(
    (point) =>
      new Body(
        context,
        Vector.from(point),
        new Vector(random(-10, 10), random(-10, 10)),
        30,
        {
          r: random(0, 255),
          g: random(0, 255),
          b: random(0, 255),
        }
      )
  );

  for (let body of bds) bodies.push(body);

  canvas.width = width;
  canvas.height = height;
  mouse.set(center.x, center.y);

  window.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );

  requestAnimationFrame(anime);
}

init();

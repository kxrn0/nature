import Body from "./Body";
import Vector from "./Vector";
import random from "./random";
import random_rgb from "./random_rgb";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const mouse = new Vector(0, 0);
const center = new Vector(0, 0);
const bodies = [];

function draw_thing(context, center) {
  const radius = random(10, 20);

  context.beginPath();
  context.fillStyle = "black";
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.fill();
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_thing(context, center);

  for (let body of bodies) {
    for (let other of bodies) if (body !== other) body.repel(other);

    body.follow(mouse);
    body.move();
    body.draw();
  }

  requestAnimationFrame(anime);
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  center.set(width / 2, height / 2);
  canvas.width = width;
  canvas.height = height;
  mouse.copy(center);

  canvas.addEventListener("click", () => {
    const position = center.clone();
    const velocity = new Vector(0, 0);
    const radius = 10;
    const mass = (Math.PI * radius * radius * radius * 4) / 3;
    const color = random_rgb();
    const body = new Body(context, position, velocity, radius, mass, color);

    bodies.push(body);
  });

  window.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );

  requestAnimationFrame(anime);
}

init();

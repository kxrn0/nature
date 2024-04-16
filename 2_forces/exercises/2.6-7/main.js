import Fric from "./Fric";
import Mover from "./Mover";
import Vector from "./Vector";
import are_colliding from "./are_colliding";
import draw_marker from "./draw_marker";
import random from "./random";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const radioBall = document.querySelector("#radioBall");
const radioFric = document.querySelector("#radioFric");
const radioPull = document.querySelector("#radioPull");
const range = document.querySelector("#range");
const STATES = {
  ADDING_BALLS: "adding_balls",
  ADDING_FRICS: "adding_frics",
  DRAGGING_BALLS: "dragging_balls",
};
const balls = [];
const frics = [];
let state, radius, mouse, dragged;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let fric of frics) {
    fric.draw();

    for (let ball of balls) if (are_colliding(ball, fric)) fric.fric(ball);
  }

  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].move();
    balls[i].draw();
  }

  if (dragged) {
    context.beginPath();
    context.strokeStyle = "#000511";
    context.moveTo(dragged.position.x, dragged.position.y);
    context.lineTo(mouse.position.x, mouse.position.y);
    context.stroke();
  }

  draw_marker(STATES, state, mouse, radius, context);

  requestAnimationFrame(anime);
}

function init() {
  state = STATES.ADDING_BALLS;
  radius = 25;
  const mousePosition = new Vector(
    window.innerWidth / 2,
    window.innerHeight / 2
  );
  mouse = { position: mousePosition, radius: 0 };
  dragged = null;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener("click", () => {
    if (state === STATES.ADDING_BALLS) {
      const color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(
        0,
        255
      )})`;
      const mu = 1 / radius;
      const position = new Vector(mouse.position.x, mouse.position.y);
      const velocity = new Vector(0, 0);
      const mover = new Mover(
        canvas,
        position,
        velocity,
        radius,
        radius,
        color,
        mu
      );

      balls.push(mover);
    } else if (state === STATES.ADDING_FRICS) {
      const position = new Vector(mouse.position.x, mouse.position.y);
      const fric = new Fric(context, position, radius);

      frics.push(fric);
    }
  });

  canvas.addEventListener("mousedown", () => {
    if (state === STATES.DRAGGING_BALLS)
      dragged = balls.find((ball) => are_colliding(mouse, ball));
  });

  canvas.addEventListener("mouseup", () => (dragged = null));

  canvas.addEventListener("mousemove", () => {
    if (!dragged) return;

    const diff = Vector.add(
      mouse.position,
      dragged.position.copy().scale(-1)
    ).scale(1 / 100);

    dragged.apply_force(diff);
  });

  radioBall.addEventListener("change", () => {
    if (radioBall.checked) {
      state = STATES.ADDING_BALLS;

      range.setAttribute("min", "5");
      range.setAttribute("max", "50");

      radius = Number(range.value);
    }
  });

  radioFric.addEventListener("change", () => {
    if (radioFric.checked) {
      state = STATES.ADDING_FRICS;

      range.setAttribute("min", "25");
      range.setAttribute("max", "100");

      radius = Number(range.value);
    }
  });

  radioPull.addEventListener("change", () => {
    if (radioPull.checked) state = STATES.DRAGGING_BALLS;
  });

  range.addEventListener("input", () => (radius = Number(range.value)));

  window.addEventListener("mousemove", (event) => {
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
  });

  requestAnimationFrame(anime);
}

init();

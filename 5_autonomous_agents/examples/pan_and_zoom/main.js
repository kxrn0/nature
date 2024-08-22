import Ball from "./components/Ball.js";
import Vector from "./components/Vector.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";
import random from "./utils/random.js";
import random_rgb from "./utils/random_rgb.js";
import screen_to_world from "./utils/screen_to_world.js";
import world_to_screen from "./utils/world_to_screen.js";
import draw_rect from "./utils/draw_rect.js";

//panning and zooming logic extracted from:
//https://github.com/OneLoneCoder/Javidx9/blob/master/ConsoleGameEngine/SmallerProjects/OneLoneCoder_PanAndZoom.cpp

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const offset = new Vector(0, 0);
const scale = new Vector(1, 1);
const dScale = new Vector(0.01, 0.01);
const startPan = new Vector(0, 0);
const mouse = new Vector(0, 0);
const balls = [];
const MODES = { MOVING: "MOVING", PANNING: "PANNING" };
const targetOffset = new Vector(0, 0);
const worldScale = Math.PI;
let isDragging, mode, target;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_rect(
    context,
    new Vector(0, 0),
    canvas.width * worldScale,
    canvas.height * worldScale,
    scale,
    offset
  );

  for (let ball of balls) ball.draw(context, offset, scale);

  requestAnimationFrame(anime);
}

function init_controls() {
  const moveItem = document.querySelector("#move-item");
  const panCanvas = document.querySelector("#pantsu");

  moveItem.addEventListener("change", () => {
    isDragging = false;
    mode = MODES.MOVING;
  });

  panCanvas.addEventListener("change", () => {
    mode = MODES.PANNING;
    target = null;
  });

  canvas.addEventListener("mousedown", (event) => {
    mouse.set(event.offsetX, event.offsetY);

    if (mode === MODES.PANNING) {
      startPan.copy(mouse);

      isDragging = true;
    } else {
      const point = new Vector(0, 0);

      screen_to_world(offset, scale, mouse, point);

      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        if (is_point_in_circle(point, ball)) {
          target = ball;
          break;
        }
      }

      if (target) targetOffset.copy(Vector.sub(target.position, point));
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    mouse.set(event.offsetX, event.offsetY);

    if (mode === MODES.PANNING) {
      if (isDragging) {
        offset.sub(Vector.sub(mouse, startPan).div(scale));

        startPan.copy(mouse);
      }
    } else {
      if (target) {
        const point = new Vector(0, 0);

        screen_to_world(offset, scale, mouse, point);

        target.position.copy(Vector.add(point, targetOffset));
      }
    }
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
    target = null;
  });

  canvas.addEventListener("wheel", (event) => {
    const mouseWorldBeforeZoom = new Vector(0, 0);
    const mouseWorldAfterZoom = new Vector(0, 0);
    const cst = { min: 0.1, max: 5 };

    screen_to_world(offset, scale, mouse, mouseWorldBeforeZoom);

    if (event.deltaY < 0) scale.add(dScale).constrain(cst, cst);
    else if (event.deltaY > 0) scale.sub(dScale).constrain(cst, cst);

    screen_to_world(offset, scale, mouse, mouseWorldAfterZoom);

    offset.add(Vector.sub(mouseWorldBeforeZoom, mouseWorldAfterZoom));
  });

  canvas.addEventListener("mouseout", () => {
    isDragging = false;
    target = null;
  });
}

function init() {
  const width = canvas.width * worldScale;
  const height = canvas.height * worldScale;

  isDragging = false;
  mode = MODES.MOVING;
  target = null;

  for (let i = 0; i < 10; i++) {
    const position = new Vector(random(0, width), random(0, height));
    const radius = random(10, 50);
    const color = random_rgb();
    const ball = new Ball(position, radius, color);

    balls.push(ball);
  }

  const position = new Vector(width / 2, height / 2);
  const radius = 10;
  const color = "white";
  const ball = new Ball(position, radius, color);

  balls.push(ball);

  init_controls();

  requestAnimationFrame(anime);
}

init();

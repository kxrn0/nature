import Vector from "./components/Vector.js";
import random from "./utils/random.js";
import is_point_in_sector from "./utils/is_point_in_sector.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const observer = {
  position: new Vector(innerWidth / 2, innerHeight / 2),
  speed: 10,
  angle: 0,
  width: 30,
  height: 20,
  vision: {
    radius: 100,
    angle: { start: -Math.PI / 4, end: Math.PI / 4 },
  },
  draw: function (context) {
    context.beginPath();
    context.fillStyle = "#d5ff9433";
    context.moveTo(this.position.x, this.position.y);
    context.arc(
      this.position.x,
      this.position.y,
      this.vision.radius,
      this.vision.angle.start,
      this.vision.angle.end
    );
    context.moveTo(this.position.x, this.position.y);
    context.fill();

    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.beginPath();
    context.fillStyle = "blue";
    context.moveTo(-this.width / 2, -this.height / 2);
    context.lineTo(this.width / 2, 0);
    context.lineTo(-this.width / 2, this.height / 2);
    context.fill();
    context.setTransform(1, 0, 0, 1, 0, 0);
  },
};
const da = 0.05;
const points = [];
let keyPressed;

function anime() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  switch (keyPressed) {
    case "ArrowLeft":
      observer.vision.angle.start -= da;
      observer.vision.angle.end -= da;
      observer.angle -= da;
      break;
    case "ArrowRight":
      observer.vision.angle.start += da;
      observer.vision.angle.end += da;
      observer.angle += da;
      break;
    case "z":
    case "Z":
      const v = Vector.from_angle(observer.angle, observer.speed);

      observer.position.add(v);
  }

  for (let point of points) {
    const isVisible = is_point_in_sector(
      point,
      observer.position,
      observer.vision.radius,
      observer.vision.angle.start,
      observer.vision.angle.end
    );
    const color = isVisible ? "red" : "gray";

    context.beginPath();
    context.fillStyle = color;
    context.arc(point.x, point.y, 5, 0, Math.PI * 2);
    context.fill();
  }

  observer.draw(context);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  keyPressed = null;

  for (let i = 0; i < 10000; i++)
    points.push(new Vector(random(0, canvas.width), random(0, canvas.height)));

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowRight":
      case "z":
      case "Z":
        keyPressed = event.key;
        break;
      default:
        keyPressed = null;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === keyPressed) keyPressed = null;
  });

  requestAnimationFrame(anime);
}

init();

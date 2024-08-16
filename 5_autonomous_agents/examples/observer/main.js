import Vector from "./components/Vector.js";
import draw_observer from "./utils/draw_observer.js";
import is_point_in_triangle from "./utils/is_point_in_triangle.js";
import update_vision from "./utils/update_vision.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const observer = {
  position: new Vector(innerWidth / 2, innerHeight / 2),
  speed: 10,
  width: 30,
  height: 15,
  angle: 0,
  vision: {
    edgeLength: 300,
    angle: Math.PI / 4,
    vertices: [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)],
  },
};
const da = 0.05;
const particles = [];
let keyPressed;

function anime() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  switch (keyPressed) {
    case "ArrowLeft":
      observer.angle -= da;
      update_vision(observer);
      break;
    case "ArrowRight":
      observer.angle += da;
      update_vision(observer);
      break;
    case "z":
    case "Z":
      const v = Vector.from_angle(observer.angle, observer.speed);

      observer.position.add(v);
      update_vision(observer);
  }

  draw_observer(context, observer);

  for (let particle of particles) {
    const isVisible = is_point_in_triangle(
      particle,
      ...observer.vision.vertices
    );
    const color = isVisible ? "red" : "green";

    context.beginPath();
    context.fillStyle = color;
    context.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
    context.fill();
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  keyPressed = null;

  update_vision(observer);

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

  canvas.addEventListener("click", (event) => {
    const particle = new Vector(event.offsetX, event.offsetY);

    particles.push(particle);
  });

  requestAnimationFrame(anime);
}

init();

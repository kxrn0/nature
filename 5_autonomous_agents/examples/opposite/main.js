import Vector from "./components/Vector.js";
import draw_arrow from "./utils/draw_arrow.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";
import is_point_in_sector from "./utils/is_point_in_sector.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const observer = {
  position: new Vector(innerWidth / 2, innerHeight / 2),
  angle: 0,
  da: 0.05,
  speed: 10,
  width: 20,
  height: 10,
  vision: {
    radius: 100,
    angle: { start: -Math.PI / 4, end: Math.PI / 4 },
  },
  draw: function (context) {
    context.beginPath();
    context.fillStyle = "orange";
    context.strokeStyle = "black";
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.moveTo(-this.width / 2, -this.height / 2);
    context.lineTo(this.width / 2, 0);
    context.lineTo(-this.width / 2, this.height / 2);
    context.fill();
    context.setTransform(1, 0, 0, 1, 0, 0);

    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.arc(
      this.position.x,
      this.position.y,
      this.vision.radius,
      this.vision.angle.start,
      this.vision.angle.end
    );
    context.lineTo(this.position.x, this.position.y);
    context.stroke();
  },
};
const ball = {
  position: new Vector(innerWidth / 2, innerHeight / 3),
  radius: 10,
  isObserved: false,
  isDragging: false,
  offset: new Vector(0, 0),
  draw: function (context) {
    const color = this.isObserved ? "red" : "blue";

    context.beginPath();
    context.fillStyle = color;
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fill();
  },
};
const opposite = new Vector(0, 0);
let keyPressed;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  switch (keyPressed) {
    case "ArrowLeft":
      observer.angle -= observer.da;
      observer.vision.angle.start -= observer.da;
      observer.vision.angle.end -= observer.da;
      break;
    case "ArrowRight":
      observer.angle += observer.da;
      observer.vision.angle.start += observer.da;
      observer.vision.angle.end += observer.da;
      break;
    case "z":
    case "Z":
      const velocity = Vector.from_angle(observer.angle, observer.speed);

      observer.position.add(velocity);
  }

  observer.draw(context);

  ball.isObserved = is_point_in_sector(
    ball.position,
    observer.position,
    observer.vision.radius,
    observer.vision.angle.start,
    observer.vision.angle.end
  );

  if (ball.isObserved) {
    const vector = Vector.from_segment(observer.position, ball.position);
    const dir = Vector.from_angle(observer.angle, 1);
    const inv = new Vector(-dir.y, dir.x);
    const dot = vector.dot(inv);

    if (dot > 0) opposite.set(-vector.y, vector.x);
    else opposite.set(vector.y, -vector.x);
  }

  ball.draw(context);

  if (ball.isObserved) {
    const start = observer.position;
    const end = observer.position.clone().add(opposite);

    draw_arrow(context, start, end);
    draw_arrow(context, observer.position, ball.position);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  keyPressed = null;

  document.addEventListener("keydown", (event) => {
    const key = event.key;

    switch (key) {
      case "ArrowLeft":
      case "ArrowRight":
      case "z":
      case "Z":
        keyPressed = key;
        break;
      default:
        keyPressed = null;
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key;

    if (key === keyPressed || key.toUpperCase() === keyPressed)
      keyPressed = null;
  });

  canvas.addEventListener("mousedown", (event) => {
    const point = new Vector(event.offsetX, event.offsetY);

    if (is_point_in_circle(point, ball)) {
      ball.offset.set(ball.position.x - point.x, ball.position.y - point.y);
      ball.isDragging = true;
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!ball.isDragging) return;

    ball.position.set(
      event.offsetX + ball.offset.x,
      event.offsetY + ball.offset.y
    );
  });

  canvas.addEventListener("mouseup", () => (ball.isDragging = false));

  requestAnimationFrame(anime);
}

init();

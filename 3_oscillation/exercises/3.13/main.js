import Body from "./Body";
import Spring from "./Spring";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = new Vector(0, 2);
let spring, bob;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!bob.isDragging) {
    bob.apply_force(gravity);
    spring.connect(bob);
  }
  bob.move();
  spring.constrain_length(bob, 30, 300);

  spring.draw(context, bob.position);
  bob.draw(context);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const anchor = new Vector(innerWidth / 2, 300);
  const restLength = 100;
  const k = 0.2;
  const springColor = "red";
  const width = 1;

  const position = new Vector(innerWidth / 2, 400);
  const velocity = new Vector(0, 0);
  const radius = 24;
  const mass = radius;
  const damping = 0.98;
  const bobColor = "orange";

  spring = new Spring(anchor, restLength, k, springColor, width);
  bob = new Body(position, velocity, radius, mass, damping, bobColor);

  canvas.addEventListener("mousedown", (event) => {
    const mouse = new Vector(event.clientX, event.clientY);

    bob.handle_click(mouse);
  });

  canvas.addEventListener("mousemove", (event) => {
    const mouse = new Vector(event.clientX, event.clientY);

    bob.drag(mouse);
  });

  canvas.addEventListener("mouseup", () => bob.release());

  requestAnimationFrame(anime);
}

init();

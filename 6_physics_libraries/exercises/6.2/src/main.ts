import Matter from "matter-js";
import Cannon from "./components/Cannon";
import Slab from "./components/Slab";
import Ball from "./components/Ball";
import "./style.css";

const p = document.querySelector("p")!;
const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;
const balls: Ball[] = [];
let cannon: Cannon;
let engine = Matter.Engine.create();
let ground: Slab;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  ground.draw(context);

  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];
    const x = ball.body.position.x;
    const y = ball.body.position.y;
    const r = ball.radius;

    ball.draw(context);

    if (x > canvas.width + r || y > canvas.height + r || x < -r || y < -r) {
      ball.destroy(engine.world);
      balls.splice(i, 1);

      p.innerText = `balls: ${balls.length}`;
    }
  }

  cannon.run(context);

  Matter.Engine.update(engine);
  requestAnimationFrame(anime);
}

function init_controls() {
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        cannon.isRotating = true;
        cannon.direction = -1;
        break;
      case "ArrowRight":
        cannon.isRotating = true;
        cannon.direction = 1;
    }
  });

  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        if (cannon.direction === 1) return;

        cannon.isRotating = false;
        break;
      case "ArrowRight":
        if (cannon.direction === -1) return;

        cannon.isRotating = false;
        break;
      case "Enter":
        const ball = cannon.shoot();

        Matter.Composite.add(engine.world, ball.body);
        balls.push(ball);

        p.innerText = `balls: ${balls.length}`;
    }
  });
}

function init() {
  const position = Matter.Vector.create(innerWidth / 2, (4 * innerHeight) / 5);
  const barrelLength = 100;

  cannon = new Cannon(position, barrelLength);

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  ground = new Slab(
    innerWidth / 2,
    (4 * innerHeight) / 5,
    innerWidth / 2,
    20,
    "green"
  );

  Matter.Composite.add(engine.world, ground.body);

  init_controls();

  requestAnimationFrame(anime);
}

init();

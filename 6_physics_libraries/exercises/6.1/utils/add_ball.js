import Matter from "matter-js";
import random from "./random";

export default function add_ball(x, y, r, world) {
  const ball = Matter.Bodies.circle(x, y, r, {
    friction: 0.01,
    restitution: 0.75,
  });
  const vx = random(-5, 5);
  const vy = random(0, -10);
  const velocity = Matter.Vector.create(vx, vy);

  Matter.Body.setVelocity(ball, velocity);
  Matter.Composite.add(world, ball);
}

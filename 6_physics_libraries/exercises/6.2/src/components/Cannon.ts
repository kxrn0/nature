import Matter from "matter-js";
import constrain from "../utils/constrain";
import Ball from "./Ball";

export default class Cannon {
  position: Matter.Vector;
  angle: number;
  minAngle: number;
  maxAngle: number;
  tip: Matter.Vector;
  width: number;
  height: number;
  barrelDiameter: number;
  barrelLength: number;
  dA: number;
  direction: 1 | -1;
  isRotating: boolean;

  constructor(position: Matter.Vector, barrelLength: number) {
    this.position = position;
    this.angle = -Math.PI / 4;
    this.minAngle = -Math.PI;
    this.maxAngle = 0;
    this.tip = Matter.Vector.create(0, 0);
    this.width = 50;
    this.height = 100;
    this.barrelLength = barrelLength;
    this.barrelDiameter = barrelLength / 3;
    this.isRotating = false;
    this.dA = 0.05;
    this.direction = 1;

    this.update_tip();
  }

  shoot() {
    const ball = new Ball(this.tip.x, this.tip.y, this.barrelDiameter / 2, "gray");
    const strength = this.barrelLength / 2500;
    const x = strength * Math.cos(this.angle);
    const y = strength * Math.sin(this.angle);
    const force = Matter.Vector.create(x, y);

    Matter.Body.applyForce(ball.body, this.tip, force);

    return ball;
  }

  update_tip() {
    const x = this.barrelLength * Math.cos(this.angle);
    const y = this.barrelLength * Math.sin(this.angle);

    this.tip.x = this.position.x + x;
    this.tip.y = this.position.y + y;
  }

  rotate_turret(dA: number) {
    this.angle = constrain(this.angle + dA, this.minAngle, this.maxAngle);
    this.update_tip();
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = "purple";
    context.fillRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height
    );

    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.fillStyle = "orange";
    context.fillRect(
      0,
      -this.barrelDiameter / 2,
      this.barrelLength,
      this.barrelDiameter
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  run(context: CanvasRenderingContext2D) {
    if (this.isRotating) this.rotate_turret(this.dA * this.direction);

    this.draw(context);
  }
}

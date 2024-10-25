import Matter from "matter-js";

export default class Ball {
  radius: number;
  body: Matter.Body;
  color: string;

  constructor(x: number, y: number, radius: number, color: string) {
    const options = { friction: 0.01, restitution: 0.75 };

    this.radius = radius;
    this.body = Matter.Bodies.circle(x, y, radius, options);
    this.color = color;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(
      this.body.position.x,
      this.body.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    context.fill();
  }

  destroy(world: Matter.Composite) {
    Matter.Composite.remove(world, this.body);
  }
}

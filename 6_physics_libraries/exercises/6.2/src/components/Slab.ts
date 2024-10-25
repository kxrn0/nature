import Matter from "matter-js";

export default class Slab {
  center: Matter.Vector;
  width: number;
  height: number;
  color: string;
  body: Matter.Body;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.center = Matter.Vector.create(x, y);
    this.width = width;
    this.height = height;
    this.color = color;
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
    });
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(
      this.center.x - this.width / 2,
      this.center.y - this.height / 2,
      this.width,
      this.height
    );
  }
}

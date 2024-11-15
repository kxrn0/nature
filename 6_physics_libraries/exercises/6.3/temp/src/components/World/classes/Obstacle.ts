import Matter from "matter-js";

export default class Obstacle {
  body: Matter.Body;
  corner: Matter.Vector;
  width: number;
  height: number;

  constructor(corner: Matter.Vector, width: number, height: number) {
    const options = { isStatic: true };

    this.body = Matter.Bodies.rectangle(
      corner.x + width / 2,
      corner.y + height / 2,
      width,
      height,
      options
    );
    this.corner = corner;
    this.width = width;
    this.height = height;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = "gray";
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.fillRect(this.corner.x, this.corner.y, this.width, this.height);
    context.strokeRect(this.corner.x, this.corner.y, this.width, this.height);
  }
}

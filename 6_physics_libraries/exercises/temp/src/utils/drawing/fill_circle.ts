import Matter from "matter-js";

export default function fill_circle(
  context: CanvasRenderingContext2D,
  center: Matter.Vector,
  radius: number,
  fillStyle: string
) {
  context.beginPath();
  context.fillStyle = fillStyle;
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.fill();
}

import Matter from "matter-js";

export default function fill_path(
  context: CanvasRenderingContext2D,
  vertices: Matter.Vector[],
  fillStyle: string
) {
  context.beginPath();
  context.fillStyle = fillStyle;
  context.moveTo(vertices[0].x, vertices[0].y);

  for (let i = 1; i < vertices.length; i++)
    context.lineTo(vertices[i].x, vertices[i].y);

  context.fill();
}

import Matter from "matter-js";

export default function stroke_path(
  context: CanvasRenderingContext2D,
  vertices: Matter.Vector[],
  strokeStyle: string,
  lineWidth: number,
  isClosed: boolean
) {
  context.beginPath();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.moveTo(vertices[0].x, vertices[0].y);

  for (let i = 1; i < vertices.length; i++)
    context.lineTo(vertices[i].x, vertices[i].y);

  if (isClosed) {
    context.lineTo(vertices[0].x, vertices[0].y);
    context.lineTo(vertices[1].x, vertices[1].y);
  }

  context.stroke();
}

import Matter from "matter-js";
import find_bb_dimensions from "../geometry/find_bb_dimensions";

export default function frame_polygon(
  vertices: Matter.Vector[],
  width: number,
  height: number,
  fillStyle: string
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) throw new Error("no context error!");

  const box = find_bb_dimensions(vertices);
  const boxLongest = Math.max(box.width, box.height);
  const canvasShortest = Math.min(width, height);
  const scale = canvasShortest / boxLongest;
  const centered = vertices.map((v) => ({
    x: (v.x - box.center.x) * scale,
    y: (v.y - box.center.y) * scale,
  }));

  canvas.width = width;
  canvas.height = height;

  context.beginPath();
  context.fillStyle = fillStyle;
  context.translate(width / 2, height / 2);
  context.moveTo(centered[0].x, centered[0].y);

  for (let i = 1; i < centered.length; i++)
    context.lineTo(centered[i].x, centered[i].y);

  context.fill();

  return canvas.toDataURL();
}

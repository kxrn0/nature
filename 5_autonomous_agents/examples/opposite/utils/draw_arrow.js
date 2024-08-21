import Vector from "../components/Vector.js";

export default function draw_arrow(context, start, end) {
  const vector = Vector.from_segment(start, end);
  const size = vector.size();
  const angle = vector.angle();

  context.beginPath();
  context.translate(start.x, start.y);
  context.rotate(angle);
  context.moveTo(0, 0);
  context.lineTo(size, 0);
  context.lineTo((9 * size) / 10, -size / 10);
  context.lineTo(size, 0);
  context.lineTo((9 * size) / 10, size / 10);
  context.stroke();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

export default function draw_circle(
  context,
  center,
  radius,
  fill,
  stroke,
  width
) {
  context.beginPath();
  context.fillStyle = fill;
  context.lineWidth = width;
  context.strokeStyle = stroke;
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();
}

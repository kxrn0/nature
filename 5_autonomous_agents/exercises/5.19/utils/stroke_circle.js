export default function stroke_circle(
  context,
  center,
  radius,
  lineWidth,
  strokeStyle
) {
  context.beginPath();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.stroke();
}

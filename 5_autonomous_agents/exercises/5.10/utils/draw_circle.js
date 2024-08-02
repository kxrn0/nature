export default function draw_circle(context, center, radius, color) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(center.x, center.y, radius, 0, Math.PI * 2);
  context.fill();
}

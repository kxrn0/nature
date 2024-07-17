function draw_point(context, point, color) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(point.x, point.y, 10, 0, Math.PI * 2);
  context.fill();
}

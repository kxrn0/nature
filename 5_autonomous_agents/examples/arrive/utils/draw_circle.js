function draw_circle(context, circle, color) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(
    circle.position.x,
    circle.position.y,
    circle.radius,
    0,
    Math.PI * 2
  );
  context.fill();
}

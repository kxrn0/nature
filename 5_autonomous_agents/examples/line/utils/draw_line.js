function draw_line(context, start, end, color, width) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

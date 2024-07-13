function draw_box(context, box, color) {
  context.fillStyle = color;
  context.strokeRect(box.corner.x, box.corner.y, box.width, box.height);
}

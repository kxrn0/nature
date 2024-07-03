function draw_polygon(vertices, color) {
  context.beginPath();
  context.fillStyle = color;
  context.strokeStyle = "black";
  context.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++)
    context.lineTo(vertices[i].x, vertices[i].y);
  context.fill();
  context.stroke();
}

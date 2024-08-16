export default function Path(points, radius) {
  this.points = points;
  this.radius = radius;
}

Path.prototype.draw = function (context) {
  Path.draw_path(context, this.points, this.radius * 2, "greenyellow");
  Path.draw_path(context, this.points, 1, "black");
};

Path.draw_path = function (context, points, width, stroke) {
  context.beginPath();
  context.lineWidth = width;
  context.strokeStyle = stroke;
  context.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length; i++)
    context.lineTo(points[i].x, points[i].y);
  context.lineTo(points[0].x, points[0].y);
  context.lineTo(points[1].x, points[1].y);
  context.stroke();
};

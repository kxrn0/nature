export default function Path(points, radius) {
  this.points = points;
  this.radius = radius;
}

Path.prototype.draw = function (context) {
  Path.draw_path(context, this.points, this.radius * 2, "orange");
  Path.draw_path(context, this.points, 1, "black");
};

Path.draw_path = function (context, points, width, stroke) {
  context.lineWidth = width;
  context.strokeStyle = stroke;
  context.lineCap = "round";
  for (let i = 0; i < points.length - 1; i++) {
    context.beginPath();
    context.moveTo(points[i].x, points[i].y);
    context.lineTo(points[i + 1].x, points[i + 1].y);
    context.stroke();
  }
};

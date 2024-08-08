export default function Path(points, radius) {
  this.points = points;
  this.isSelected = true;
  this.drawMode = Path.DRAW_MODES.SELECTED;
  this.radius = radius;
}

Path.prototype.draw = function (context) {
  if (this.drawMode === Path.DRAW_MODES.MOVING) {
    Path.draw_path(context, this.points, 3, "blue");

    for (let i = 0; i < this.points.length; i++) {
      context.beginPath();
      context.arc(
        this.points[i].x,
        this.points[i].y,
        Path.POINT_RADIUS,
        0,
        Math.PI * 2
      );
      context.fill();
    }
  } else {
    let base;

    if (this.drawMode === Path.DRAW_MODES.NORMAL) base = "gray";
    else base = "orange";

    Path.draw_path(context, this.points, this.radius * 2, base);
    Path.draw_path(context, this.points, 1, "black");
  }
};

Path.prototype.deselect = function () {
  this.isSelected = false;
  this.drawMode = Path.DRAW_MODES.NORMAL;
};

Path.DRAW_MODES = {
  NORMAL: "NORMAL",
  SELECTED: "SELECTED",
  MOVING: "MOVING",
};

Path.POINT_RADIUS = 10;

Path.draw_path = function (context, points, width, stroke) {
  context.beginPath();
  context.lineWidth = width;
  context.strokeStyle = stroke;
  context.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < points.length; i++)
    context.lineTo(points[i].x, points[i].y);
  context.stroke();
};

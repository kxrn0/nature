export default function Path(points) {
  this.points = points;
  this.isActive = true;
}

Path.prototype.draw = function (context) {
  const base = this.isActive ? "red" : "yellow";
  const line = this.isActive ? "white" : "black";

  context.beginPath();
  context.strokeStyle = base;
  context.lineWidth = 10;
  context.moveTo(this.points[0].x, this.points[0].y);

  for (let i = 1; i < this.points.length; i++)
    context.lineTo(this.points[i].x, this.points[i].y);

  context.stroke();

  context.beginPath();
  context.strokeStyle = line;
  context.lineWidth = 1;
  context.moveTo(this.points[0].x, this.points[0].y);
  for (let i = 1; i < this.points.length; i++)
    context.lineTo(this.points[i].x, this.points[i].y);

  context.stroke();
};

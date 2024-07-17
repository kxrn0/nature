function Wall(start, end) {
  this.start = start.clone();
  this.end = end.clone();
}

Wall.prototype.draw = function (context) {
  context.beginPath();
  context.strokeStyle = "blue";
  context.lineWidth = 5;
  context.moveTo(this.start.x, this.start.y);
  context.lineTo(this.end.x, this.end.y);
  context.stroke();
};

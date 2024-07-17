function Wall(start, end, influence) {
  this.start = start;
  this.end = end;
  this.center = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
  this.width = Math.sqrt(
    (end.x - start.x) * (end.x - start.x) +
      (end.y - start.y) * (end.y - start.y)
  );
  this.height = influence;
  this.angle = Math.atan2(end.y - start.y, end.x - start.x);
  this.isOn = false;
}

Wall.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.isOn ? "red" : "orange";
  context.translate(this.center.x, this.center.y);
  context.rotate(this.angle);
  context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(this.start.x, this.start.y);
  context.lineTo(this.end.x, this.end.y);
  context.stroke();
};

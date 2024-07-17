function Line(start, end) {
  this.start = { x: start.x, y: start.y };
  this.end = { x: end.x, y: end.y };
  this.points = [];
  this.isSelected = false;
  this.width = dist(start, end);
  this.height = 50;
  this.influence = this.height * 4;
  this.center = midPoint(start, end);
  this.angle = Math.atan2(end.y - start.y, end.x - start.x);

  this.draw = function (context) {
    const length = 10;

    draw_line(context, this.start, this.end, "red", 5);

    for (let point of this.points) {
      draw_line(context, point.coords, point.closest, "blue", 3);

      context.strokeRect(
        point.coords.x - length / 2,
        point.coords.y - length / 2,
        length,
        length
      );
    }

    context.strokeStyle = this.isSelected ? "red" : "skyblue";
    context.lineWidth = 2;
    context.translate(this.center.x, this.center.y);
    context.rotate(this.angle);
    context.strokeRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    context.strokeStyle = "pink";
    context.strokeRect(
      -this.width / 2,
      -this.influence / 2,
      this.width,
      this.influence
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  };
}

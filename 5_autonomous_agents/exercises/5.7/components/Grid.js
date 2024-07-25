function Grid(resolution, width, height, fun) {
  this.resolution = resolution;
  this.cols = Math.floor(width / resolution) + 1;
  this.rows = Math.floor(height / resolution) + 1;
  this.vectors = new Array(this.cols);

  for (let x = 0; x < this.cols; x++)
    for (let y = 0; y < this.rows; y++) this.vectors[x] = new Array(this.rows);

  fun(this.vectors, this.resolution, this.cols, this.rows);
}

Grid.prototype.look = function (position) {
  const x = constrain(~~(position.x / this.resolution), 0, this.cols);
  const y = constrain(~~(position.y / this.resolution), 0, this.rows);

  return this.vectors[x][y];
};

Grid.prototype.draw = function (context) {
  for (let x = 0; x < this.cols; x++)
    for (let y = 0; y < this.rows; y++) {
      const vector = this.vectors[x][y];
      const cx = this.resolution * x;
      const cy = this.resolution * y;
      const sx = cx - vector.x / 2;
      const sy = cy - vector.y / 2;
      const ex = cx + vector.x / 2;
      const ey = cy + vector.y / 2;
      const up = vector
        .clone()
        .set_angle(vector.angle() - 2.5)
        .scale(1 / 5);
      const down = vector
        .clone()
        .set_angle(vector.angle() + 2.5)
        .scale(1 / 5);

      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(ex, ey);

      context.lineTo(ex + up.x, ey + up.y);
      context.lineTo(ex, ey);
      context.lineTo(ex + down.x, ey + down.y);
      context.stroke();
    }
};

Grid.prototype.apply_function = function (fun) {
  fun(this.vectors, this.resolution, this.cols, this.rows);
};

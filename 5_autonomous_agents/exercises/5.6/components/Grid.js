export default function Grid(resolution, width, height, fun) {
  this.resolution = resolution;
  this.cols = Math.floor(width / resolution) + 1;
  this.rows = Math.floor(height / resolution) + 1;
  this.vectors = new Array(this.cols);

  for (let x = 0; x < this.cols; x++)
    for (let y = 0; y < this.rows; y++) this.vectors[x] = new Array(this.rows);

  fun(this.vectors, this.resolution, this.cols, this.rows);
}

Grid.prototype.draw = function (context) {
  for (let x = 0; x < this.cols; x++)
    for (let y = 0; y < this.rows; y++) {
      const vector = this.vectors[x][y];
      const angle = vector.angle();

      context.beginPath();
      context.translate(x * this.resolution, y * this.resolution);
      context.rotate(angle);
      context.moveTo(-this.resolution / 2, 0);
      context.lineTo(this.resolution / 2, 0);
      context.stroke();

      context.beginPath();
      context.moveTo((3 * this.resolution) / 8, this.resolution / 8);
      context.lineTo(this.resolution / 2, 0);
      context.lineTo((3 * this.resolution) / 8, -this.resolution / 8);
      context.stroke();

      context.setTransform(1, 0, 0, 1, 0, 0);

      context.beginPath();
      context.arc(
        x * this.resolution,
        y * this.resolution,
        this.resolution / 15,
        0,
        Math.PI * 2
      );
      context.stroke();
    }
};

Grid.prototype.apply_function = function (fun) {
  fun(this.vectors, this.resolution, this.cols, this.rows);
};

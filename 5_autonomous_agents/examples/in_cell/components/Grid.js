export default function Grid(corner, width, height, res) {
  const remW = width % res;
  const remH = height % res;

  width -= remW;
  height -= remH;

  this.corner = corner;
  this.width = width;
  this.height = height;
  this.res = res;
  this.cols = Math.round(width / res);
  this.rows = Math.round(height / res);
}

Grid.prototype.draw = function (context) {
  context.lineWidth = "2";
  context.strokeStyle = "black";

  for (let x = 0; x <= this.cols; x++) {
    context.beginPath();
    context.moveTo(this.corner.x + x * this.res, this.corner.y);
    context.lineTo(this.corner.x + x * this.res, this.corner.y + this.height);
    context.stroke();
  }

  for (let y = 0; y <= this.rows; y++) {
    context.beginPath();
    context.moveTo(this.corner.x, this.corner.y + y * this.res);
    context.lineTo(this.corner.x + this.width, this.corner.y + y * this.res);
    context.stroke();
  }

  context.textAlign = "center";
  for (let x = 0; x < this.cols; x++)
    for (let y = 0; y < this.rows; y++) {
      const number = x + y * this.cols;
      const xp = this.corner.x + x * this.res + this.res / 2;
      const yp = this.corner.y + y * this.res + this.res / 2;

      context.fillText(number, xp, yp);
    }
};

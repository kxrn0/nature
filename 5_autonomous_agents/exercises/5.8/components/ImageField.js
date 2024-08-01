import Vector from "./Vector.js";
import map from "../utils/map.js";

export default function ImageField(img, width, height, res, center) {
  this.img = img;
  this.width = width;
  this.height = height;
  this.res = res;
  this.center = center;
  this.field = ImageField.create_field(img, width, height, res);
  this.drawImage = false;
}

ImageField.prototype.retrieve = function (position) {
  const { x, y } = position;
  const w2 = this.width / 2;
  const h2 = this.height / 2;
  const cx = this.center.x - w2;
  const cy = this.center.y - h2;
  const ex = this.center.x + w2;
  const ey = this.center.y + h2;

  if (x < cx || ex <= x || y < cy || ey <= y) return null;

  const xi = ~~((x - cx) / this.res);
  const yi = ~~((y - cy) / this.res);
  const i = xi + yi * this.field.cols;

  return this.field.vectors[i].clone();
};

ImageField.prototype.draw = function (context) {
  const corner = new Vector(
    this.center.x - this.width / 2,
    this.center.y - this.height / 2
  );

  if (this.drawImage)
    context.drawImage(
      this.img,
      0,
      0,
      this.img.naturalWidth,
      this.img.naturalHeight,
      corner.x,
      corner.y,
      this.width,
      this.height
    );

  for (let y = 0; y < this.field.rows; y++)
    for (let x = 0; x < this.field.cols; x++) {
      const vector = this.field.vectors[x + y * this.field.cols];
      const cx = this.res * x + corner.x;
      const cy = this.res * y + corner.y;
      const hx = vector.x / 2;
      const hy = vector.y / 2;
      const sx = cx - hx;
      const sy = cy - hy;
      const ex = cx + hx;
      const ey = cy + hy;
      const angle = vector.angle();
      const up = vector
        .clone()
        .set_angle(angle - 2.5)
        .scale(1 / 5);
      const down = vector
        .clone()
        .set_angle(angle + 2.5)
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

ImageField.create_field = function (img, width, height, res) {
  const valueMap = ImageField.create_value_map(img, width, height, res);
  const field = { vectors: [], cols: valueMap.cols, rows: valueMap.rows };

  for (let y = 0; y < field.rows; y++)
    for (let x = 0; x < field.cols; x++) {
      const vector = ImageField.get_average(x, y, valueMap, res);

      field.vectors.push(vector);
    }

  return field;
};

ImageField.get_average = function (x, y, valueMap, res) {
  const currentValue = valueMap.pixels[x + y * valueMap.cols];
  let sx, sy;

  sx = 0;
  sy = 0;

  for (let dx = -1; dx < 2; dx++) {
    for (let dy = -1; dy < 2; dy++) {
      const ix = x + dx;
      const iy = y + dy;

      if (ix === x && iy === y) continue;

      if (0 <= ix && ix < valueMap.cols && 0 <= iy && iy < valueMap.rows) {
        const value = valueMap.pixels[ix + iy * valueMap.cols];
        const angle = Math.atan2(ix - x, iy - y);
        const diff = value - currentValue;
        const dir = diff > 0 ? 1 : -1;
        const mag = map(Math.abs(diff), 0, 255, 0, res);

        sx += dir * mag * Math.cos(angle);
        sy += dir * mag * Math.sin(angle);
      }
    }
  }

  return new Vector(sx, sy);
};

ImageField.create_value_map = function (img, width, height, res) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const dw = width % res;
  const dh = height % res;
  const res2 = res * res;

  canvas.width = width + dw;
  canvas.height = height + dh;

  context.drawImage(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const cols = ~~(canvas.width / res);
  const rows = ~~(canvas.height / res);
  const valueData = { pixels: [], rows, cols };
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const start = 4 * res * (x + y * canvas.width);
      let r, g, b;

      r = g = b = 0;

      for (let dx = 0; dx < res; dx++)
        for (let dy = 0; dy < res; dy++) {
          const i = start + 4 * (dx + dy * canvas.width);

          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

      r /= res2;
      g /= res2;
      b /= res2;

      const value = (r + g + b) / 3;

      valueData.pixels.push(value);
    }

  return valueData;
};

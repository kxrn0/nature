import map from "../utils/map.js";
import { createNoise2D } from "../utils/simplex.js";
import Vector from "./Vector.js";

export default function PerlinField(center, width, height, res, dt) {
  const dw = width % res;
  const dh = height % res;

  this.center = center;
  this.corner = new Vector(center.x - width / 2, center.y - height / 2);
  this.width = width + dw;
  this.height = height + dh;
  this.res = res;
  this.cols = ~~(this.width / res) + 1;
  this.rows = ~~(this.height / res) + 1;
  this.vectors = [];

  let xOff;

  xOff = 0;
  for (let y = 0; y < this.rows; y++) {
    let yOff;

    yOff = 0;
    for (let x = 0; x < this.cols; x++) {
      const index = x + y * this.cols;
      const simp = PerlinField.noise(xOff, yOff);
      const angle = map(simp, -1, 1, 0, Math.PI * 2);

      this.vectors[index] = Vector.from_angle(angle, this.res);

      yOff += dt;
    }

    xOff += dt;
  }
}

PerlinField.prototype.retrieve = function (position) {
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
  const i = xi + yi * this.cols;

  return this.vectors[i].clone();
};

PerlinField.prototype.draw = function (context) {
  const corner = new Vector(
    this.center.x - this.width / 2,
    this.center.y - this.height / 2
  );

  for (let y = 0; y < this.rows; y++)
    for (let x = 0; x < this.cols; x++) {
      const vector = this.vectors[x + y * this.cols];
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

PerlinField.noise = createNoise2D();

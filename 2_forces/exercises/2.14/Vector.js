export default function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (other) {
    this.x += other.x;
    this.y += other.y;

    return this;
  };

  this.scale = function (n) {
    this.x *= n;
    this.y *= n;

    return this;
  };

  this.normalize = function () {
    const length = this.get_length();

    if (!length) return this;

    this.x /= length;
    this.y /= length;

    return this;
  };

  this.copy = function () {
    return new Vector(this.x, this.y);
  };

  this.get_length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  this.get_angle = function () {
    return Math.atan2(this.y, this.x);
  };

  this.set_length = function (length) {
    this.normalize();
    this.scale(length);
  };

  this.rotate_by = function (angle, pivot = new Vector(0, 0)) {
    const v = Vector.add(this, pivot.copy().scale(-1));
    const mag = v.get_length();
    const t = v.get_angle();
    const x = mag * Math.cos(t + angle) + pivot.x;
    const y = mag * Math.sin(t + angle) + pivot.y;

    this.set(x, y);
  };

  this.set = function (x, y) {
    this.x = x;
    this.y = y;
  };

  this.constrain = function (maxLength) {
    if (this.get_length() > maxLength) this.set_length(maxLength);
  };
}

Vector.from = (obj) => {
  const x = Number(obj.x);
  const y = Number(obj.y);

  if (isNaN(x * y)) throw new Error("fuck!");

  return new Vector(x, y);
};

Vector.add = (u, v) => new Vector(u.x + v.x, u.y + v.y);

Vector.dot = (u, v) => u.x * v.x + u.y * v.y;

Vector.scale = (v, n) => v.copy().scale(n);

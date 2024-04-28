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

  this.set_length = function (length) {
    this.normalize();
    this.scale(length);
  };

  this.set = function (x, y) {
    this.x = x;
    this.y = y;
  };
}

Vector.add = (u, v) => new Vector(u.x + v.x, u.y + v.y);

Vector.dot = (u, v) => u.x * v.x + u.y * v.y;

Vector.scale = (v, n) => v.copy().scale(n);

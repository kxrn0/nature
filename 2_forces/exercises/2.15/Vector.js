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
    const size = this.size();

    if (!size) return this;

    this.scale(1 / size);

    return this;
  };

  this.set_size = function (size) {
    this.normalize().scale(size);

    return this;
  };

  this.size = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  this.set = function (x, y) {
    this.x = x;
    this.y = y;

    return this;
  };

  this.copy = function (v) {
    this.x = v.x;
    this.y = v.y;
  };

  this.clone = function () {
    return new Vector(this.x, this.y);
  };
}

Vector.add = function (u, v) {
  return new Vector(u.x + v.x, u.y + v.y);
};

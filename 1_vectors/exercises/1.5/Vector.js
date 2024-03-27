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

  this.get_angle = function () {
    return Math.atan2(this.y, this.x);
  };

  this.get_length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  this.copy = function () {
    return new Vector(this.x, this.y);
  };

  this.normalize = function () {
    const length = this.get_length();

    if (!length) return this;

    this.scale(1 / length);

    return this;
  };
}

Vector.normal_from_angle = (angle) => {
  return new Vector(Math.cos(angle), Math.sin(angle));
};

Vector.add = function (a, b) {
  return new Vector(a.x + b.x, a.y + b.y);
};

Vector.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

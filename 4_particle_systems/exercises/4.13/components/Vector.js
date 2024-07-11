function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;

  return this;
};

Vector.prototype.scale = function (n) {
  this.x /= n;
  this.y /= n;

  return this;
};

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.from_angle = function (angle, size) {
  const x = size * Math.cos(angle);
  const y = size * Math.sin(angle);

  return new Vector(x, y);
};

Vector.random_from_range = function (a, b, size) {
  const angle = random(a, b);
  const x = size * Math.cos(angle);
  const y = size * Math.sin(angle);

  return new Vector(x, y);
};

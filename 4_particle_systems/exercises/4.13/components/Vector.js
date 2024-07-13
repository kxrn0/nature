function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;

  return this;
};

Vector.prototype.set_size = function (size) {
  this.normalize();
  this.scale(size);

  return this;
};

Vector.prototype.normalize = function () {
  const size = this.size();

  if (size === 0) return this;

  this.scale(1 / size);

  return this;
};

Vector.prototype.size = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.scale = function (n) {
  this.x *= n;
  this.y *= n;

  return this;
};

Vector.prototype.set = function (x, y) {
  this.x = x;
  this.y = y;
};

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.from_angle = function (angle, size) {
  const x = size * Math.cos(angle);
  const y = size * Math.sin(angle);

  return new Vector(x, y);
};

Vector.sub = function (u, v) {
  return new Vector(u.x - v.x, u.y - v.y);
};

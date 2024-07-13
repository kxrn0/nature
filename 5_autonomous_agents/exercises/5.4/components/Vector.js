function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;

  return this;
};

Vector.sub = function (other) {
  this.x -= other.x;
  this.y -= other.y;
  return this;
};

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.copy = function (v) {
  this.x = v.x;
  this.y = v.y;

  return this;
};

Vector.prototype.set_size = function (n) {
  this.normalize().scale(n);

  return this;
};

Vector.prototype.set = function (x, y) {
  this.x = x;
  this.y = y;

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

Vector.prototype.normalize = function () {
  const size = this.size();

  if (!size) return this;

  this.scale(1 / size);

  return this;
};

Vector.prototype.angle = function () {
  return Math.atan2(this.y, this.x);
};

Vector.prototype.limit = function (min, max) {
  const size = this.size();

  if (size < min) this.set_size(min);
  else if (size > max) this.set_size(max);
};

Vector.add = function (u, v) {
  return new Vector(u.x + v.x, u.y + v.y);
};

Vector.sub = function (u, v) {
  return new Vector(u.x - v.x, u.y - v.y);
};

Vector.from = function (obj) {
  return new Vector(obj.x, obj.y);
};

Vector.from_angle = function (a, size = 1) {
  return new Vector(size * Math.cos(a), size * Math.sin(a));
};

Vector.random = function (size = 1) {
  const angle = random(0, Math.PI * 2);

  return new Vector(size * Math.cos(angle), size * Math.sin(angle));
};

Vector.from_range = function (range) {
  const x = random(range.x.min, range.x.max);
  const y = random(range.y.min, range.y.max);

  return new Vector(x, y);
};

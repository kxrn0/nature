export default function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;

  return this;
};

Vector.prototype.sub = function (other) {
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

Vector.prototype.constrain = function (x, y) {
  if (this.x < x.min) this.x = x.min;
  if (this.x > x.max) this.x = x.max;
  if (this.y < y.min) this.y = y.min;
  if (this.y > y.max) this.y = y.max;
};

Vector.prototype.set_angle = function (angle) {
  this.copy(Vector.from_angle(angle, this.size()));

  return this;
};

Vector.prototype.mult = function (other) {
  this.x *= other.x;
  this.y *= other.y;

  return this;
};

Vector.prototype.div = function (other) {
  if (other.x === 0 || other.y === 0) throw new Error("Fuck!");

  this.x /= other.x;
  this.y /= other.y;

  return this;
};

Vector.prototype.dot = function (other) {
  return this.x * other.x + this.y * other.y;
};

Vector.prototype.angle_between = function (other) {
  const dot = this.dot(other);
  const deno = this.size() * other.size();
  const angle = Math.acos(dot / deno);

  return angle;
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

Vector.from_angle = function (a, size) {
  return new Vector(size * Math.cos(a), size * Math.sin(a));
};

Vector.dist = function (u, v) {
  const dx = u.x - v.x;
  const dy = u.y - v.y;

  return Math.sqrt(dx * dx + dy * dy);
};

Vector.from_segment = function (start, end) {
  return new Vector(end.x - start.x, end.y - start.y);
};

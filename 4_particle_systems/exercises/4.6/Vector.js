function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (other) {
    this.x += other.x;
    this.y += other.y;

    return this;
  };

  this.clone = function () {
    return new Vector(this.x, this.y);
  };

  this.copy = function (v) {
    this.x = v.x;
    this.y = v.y;

    return this;
  };

  this.set_size = function (n) {
    this.normalize().scale(n);

    return this;
  };

  this.set = function (x, y) {
    this.x = x;
    this.y = y;

    return this;
  };

  this.size = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
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

  this.angle = function () {
    return Math.atan2(this.y, this.x);
  };
}

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

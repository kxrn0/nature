function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.add = function (other) {
  this.x += other.x;
  this.y += other.y;
};

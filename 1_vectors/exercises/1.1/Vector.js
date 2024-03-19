export default function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (other) {
    this.x += other.x;
    this.y += other.y;
  };

  this.add_safe = function (other, boundaries) {
    const x = this.x + other.x;
    const y = this.y + other.y;

    if (boundaries.x.min < x && x < boundaries.x.max) this.x = x;
    else {
      if (x < boundaries.x.min) this.x = boundaries.x.min;
      else this.x = boundaries.x.max;
    }

    if (boundaries.y.min < y && y < boundaries.y.max) this.y = y;
    else {
      if (y < boundaries.y.min) this.y = boundaries.y.min;
      else this.y = boundaries.y.max;
    }
  };
}

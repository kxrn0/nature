export default function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (other) {
    this.x += other.x;
    this.y += other.y;
  };

  this.scale = function (n) {
    this.x *= n;
    this.y *= n;
  };
}

Vector.add = (u, v) => new Vector(u.x + v.x, u.y + v.y);

Vector.scale = (v, n) => new Vector(v.x * n, v.y * n);

export default function Vector(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.add = function (other) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  };
}

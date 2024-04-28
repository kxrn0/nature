import Vector from "./Vector";

export default function Mover(
  canvas,
  position,
  velocity,
  mass,
  size,
  color,
  cd
) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.velocity = velocity;
  this.acceleration = new Vector(0, 0);
  this.mass = mass;
  this.size = size;
  this.color = color;
  this.cd = cd;

  this.boundaries = {
    x: { min: size, max: canvas.width - size },

    y: { min: size, max: canvas.height - size },
  };

  this.apply_force = function (force) {
    const updated = force.copy().scale(1 / this.mass);

    this.acceleration.add(updated);
  };

  this.check_edges = function () {
    if (this.position.x < this.boundaries.x.min) {
      this.position.x = this.boundaries.x.min;
      this.velocity.x *= -1;
    }
    if (this.boundaries.x.max < this.position.x) {
      this.position.x = this.boundaries.x.max;
      this.velocity.x *= -1;
    }

    if (this.position.y < this.boundaries.y.min) {
      this.position.y = this.boundaries.y.min;
      this.velocity.y *= -1;
    }
    if (this.boundaries.y.max < this.position.y) {
      this.position.y = this.boundaries.y.max;
      this.velocity.y *= -1;
    }
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.scale(0);

    this.check_edges();
  };

  this.draw = function () {
    const mid = this.size / 2;
    const x = this.position.x - mid;
    const y = this.position.y - mid;

    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.rect(x, y, this.size, this.size);
    this.context.fill();
  };
}

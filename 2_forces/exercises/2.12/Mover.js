import Vector from "./Vector";

export default function Mover(canvas, position, velocity, radius, color) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.velocity = velocity;
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = Math.PI * radius * radius;
  this.color = color;

  this.boundaries = {
    x: { min: radius, max: canvas.width - radius },
    y: { min: radius, max: canvas.height - radius },
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

    // this.check_edges();
  };

  this.draw = function (color) {
    this.context.beginPath();
    this.context.fillStyle = color || this.color;
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();
  };
}

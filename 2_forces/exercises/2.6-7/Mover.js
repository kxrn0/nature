import Vector from "./Vector";

export default function Mover(
  canvas,
  position,
  velocity,
  mass,
  radius,
  color,
  mu,
  boundaries
) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.velocity = velocity;
  this.acceleration = new Vector(0, 0);
  this.mass = mass;
  this.radius = radius;
  this.color = color;
  this.mu = mu;

  if (boundaries) this.boundaries = boundaries;
  else
    this.boundaries = {
      x: { min: radius, max: canvas.width - radius },
      y: { min: radius, max: canvas.height - radius },
    };

  this.apply_force = function (force, dt) {
    const updated = force.copy().scale(dt / this.mass);

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
    this.velocity.scale(0.99);
    this.acceleration.scale(0);
  };

  this.draw = function () {
    this.context.beginPath();
    this.context.fillStyle = this.color;
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

import Vector from "./Vector";

export default function Mover(context, position, velocity, radius, color) {
  this.context = context;
  this.position = position;
  this.velocity = velocity;
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = Math.PI * radius * radius;
  this.color = color;

  this.apply_force = function (force) {
    const updated = force.copy().scale(1 / this.mass);

    this.acceleration.add(updated);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
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

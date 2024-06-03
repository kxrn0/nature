import Vector from "./Vector";

export default function Body(position, velocity, radius, mass, damping, color) {
  this.position = position.clone();
  this.velocity = velocity.clone();
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = mass;
  this.damping = damping;
  this.color = color;

  this.apply_force = function (force) {
    force = force.clone();
    force.scale(1 / this.mass);

    this.acceleration.add(force);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.velocity.scale(this.damping);
    this.position.add(this.velocity);
    this.acceleration.scale(0);
  };

  this.draw = function (context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fill();
  };
}

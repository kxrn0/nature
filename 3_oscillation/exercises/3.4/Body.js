import Vector from "./Vector";

export default function Body(position, velocity, radius, mass) {
  this.position = position;
  this.velocity = velocity;
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = mass;
  this.angle = 0;

  this.apply_force = function (force) {
    force = force.clone().scale(1 / this.mass);

    this.acceleration.add(force);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.scale(0);
    this.angle = Math.atan2(this.velocity.y, this.velocity.x);
  };
}

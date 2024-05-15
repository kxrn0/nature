import Vector from "./Vector";
import constrain from "./constrain";

export default function Body(
  position,
  velocity,
  radius,
  mass,
  fillStyle = "orange",
  strokeStyle = "red"
) {
  this.position = position;
  this.velocity = velocity;
  this.radius = radius;
  this.mass = mass;
  this.fillStyle = fillStyle;
  this.strokeStyle = strokeStyle;
  this.acceleration = new Vector(0, 0);
  this.angle = 0;
  this.angularVelocity = 0;
  this.angularAcceleration = 0;

  this.apply_force = function (force) {
    force = force.clone().scale(1 / this.mass);

    this.angularAcceleration += force.x / 10;
    this.acceleration.add(force);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.scale(0);

    this.angularVelocity += this.angularAcceleration;
    this.angularVelocity = constrain(this.angularVelocity, -0.1, 0.1);
    this.angle += this.angularVelocity;
  };

  this.draw = function (context) {
    context.beginPath();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.fillStyle = this.fillStyle;
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = this.strokeStyle;
    context.moveTo(0, 0);
    context.lineTo(0, this.radius);
    context.stroke();
    context.setTransform(1, 0, 0, 1, 0, 0);
  };
}

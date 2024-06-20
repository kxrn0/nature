import Vector from "./Vector";

export default function Pendulum(pivot, angle, damping, armLength, bobRadius) {
  this.pivot = pivot;
  this.armLength = armLength;
  this.bobRadius = bobRadius;
  this.bobPosition = new Vector(Math.sin(angle), Math.cos(angle))
    .scale(armLength)
    .add(pivot);
  this.angle = angle;
  this.angularVelocity = 0;
  this.angularAcceleration = 0;
  this.damping = damping;

  this.move = function (gravity) {
    this.angularAcceleration =
      (-1 * gravity * Math.sin(this.angle)) / this.armLength;
    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
    this.angularVelocity *= this.damping;

    this.bobPosition.copy(
      new Vector(Math.sin(this.angle), Math.cos(this.angle))
        .scale(this.armLength)
        .add(this.pivot)
    );
  };

  this.draw = function (context) {
    context.beginPath();
    context.moveTo(this.pivot.x, this.pivot.y);
    context.lineTo(this.bobPosition.x, this.bobPosition.y);
    context.stroke();
    context.beginPath();
    context.arc(
      this.bobPosition.x,
      this.bobPosition.y,
      this.bobRadius,
      0,
      Math.PI * 2
    );
    context.fill();
  };
}

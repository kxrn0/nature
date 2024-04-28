import Vector from "./Vector";

export default function Attractor(context, position, radius, color) {
  this.context = context;
  this.position = position;
  this.radius = radius;
  this.mass = Math.PI * radius * radius;
  this.color = color;

  this.attract = function (mover) {
    const force = Vector.add(this.position, mover.position.copy().scale(-1));
    const distance = Math.min(
      Math.max(force.get_length(), this.radius),
      this.radius * 10
    );

    const strength =
      (Attractor.G * this.mass * mover.mass) / (distance * distance);

    force.set_length(strength);

    mover.apply_force(force);
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

Attractor.G = 1;

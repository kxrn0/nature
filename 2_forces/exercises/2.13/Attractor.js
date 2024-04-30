import Vector from "./Vector";

export default function Attractor(context, position, radius, color) {
  this.context = context;
  this.position = position;
  this.radius = radius;
  this.mass = Math.PI * radius * radius;
  this.color = color;

  this.attract = function (mover) {
    const force = Vector.add(this.position, mover.position.copy().scale(-1));
    const max = Math.max(this.radius, force.get_length());
    const mag = -Math.pow(this.radius, 4) / max + this.radius * this.radius;

    force.set_length(mag);

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
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius * this.radius,
      0,
      Math.PI * 2
    );
    this.context.stroke();
  };
}

Attractor.G = 1;

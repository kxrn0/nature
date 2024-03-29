import Vector from "./Vector";

export default function Attractor(canvas, position, force, radius, color) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.force = force;
  this.radius = radius;
  this.color = color;

  this.attract = function (mover, dt) {
    const direction = new Vector(
      this.position.x - mover.position.x,
      this.position.y - mover.position.y
    );
    const length = direction.get_length();
    const ourLength = length < 1 ? 1 : length;
    const magnitude = this.force / ourLength;

    direction.set_length(magnitude);

    mover.push(direction, dt);
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

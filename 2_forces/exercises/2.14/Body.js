import Vector from "./Vector";
import constrain from "./constrain";
import map from "./map";

export default function Body(context, position, velocity, radius, color) {
  this.context = context;
  this.position = position;
  this.velocity = velocity;
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = Math.PI * radius * radius;
  this.color = color;
  this.colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  this.maxSegments = 100;
  this.tail = [];

  this.attract = function (other) {
    const force = Vector.add(this.position, other.position.copy().scale(-1));
    const mag = constrain(force.get_length(), this.radius, this.radius * 10);
    const strength = (Body.G * (this.mass * other.mass)) / (mag * mag);

    force.set_length(strength);
    other.apply_force(force);
  };

  this.apply_force = function (force) {
    const updated = force.copy().scale(1 / this.mass);

    this.acceleration.add(updated);
  };

  this.move = function () {
    this.velocity.add(this.acceleration).constrain(25);
    this.position.add(this.velocity);
    this.acceleration.scale(0);

    if (this.tail.length < this.maxSegments)
      this.tail.unshift({
        position: this.position.copy(),
        radius: this.radius,
        opacity: 1,
      });
    else this.tail.pop();

    for (let i = 0; i < this.tail.length; i++) {
      const segment = this.tail[i];

      segment.radius = Math.max(
        this.radius - map(i, 0, this.tail.length, 1, this.radius),
        1
      );
      segment.opacity = 1 - map(i, 0, this.tail.length, 0, 1);
    }
  };

  this.draw = function () {
    this.context.beginPath();
    this.context.fillStyle = this.colorStr;
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();

    for (let segment of this.tail) {
      this.context.beginPath();
      this.context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b}, ${segment.opacity})`;
      this.context.arc(
        segment.position.x,
        segment.position.y,
        segment.radius,
        0,
        Math.PI * 2
      );
      this.context.fill();
    }
  };
}

Body.G = 1;

import Vector from "./Vector";

export default function Body(context, position, velocity, radius, mass, color) {
  this.context = context;
  this.position = position.clone();
  this.velocity = velocity.clone();
  this.radius = radius;
  this.mass = mass;
  this.color = color;
  this.acceleration = new Vector(0, 0);

  this.follow = function (point) {
    const force = Vector.add(point, this.position.clone().scale(-1));
    const size = Math.min(Math.max(force.size(), this.radius), this.mass * 2);
    const strength = (Body.G * this.mass * this.mass) / (size * size);

    force.set_size(strength);

    this.apply_force(force);
  };

  this.repel = function (other) {
    const force = Vector.add(other.position, this.position.clone().scale(-1));
    const size = Math.min(Math.max(force.size(), this.radius), this.mass * 2);
    const strength = (Body.G * this.mass * other.mass) / (size * size);

    force.set_size(strength);

    other.apply_force(force);
  };

  this.apply_force = function (force) {
    force = force.clone().scale(1 / this.mass);

    this.acceleration.add(force);
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

Body.G = 1;

import dist from "../utils/dist.js";
import Vector from "./Vector.js";

export default function Vehicle(
  position,
  radius,
  mass,
  color,
  maxSpeed,
  maxForce
) {
  this.position = position;
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = mass;
  this.color = color;
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.maxDist = radius * 2;
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.separate = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    if (other === this) continue;

    const distance = Math.max(dist(this.position, other.position), 1);

    if (distance <= this.maxDist * 2) {
      const diff = Vector.sub(this.position, other.position);

      diff.scale(1 / distance);

      sum.add(diff);
      count++;
    }
  }

  if (count) {
    sum.set_size(this.maxSpeed);

    const steer = Vector.sub(sum, this.velocity);

    steer.limit(0, this.maxForce);

    this.apply_force(steer);
  }
};

Vehicle.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;
  context.arc(this.position.x, this.position.y, this.maxDist, 0, Math.PI * 2);
  context.stroke();
};

Vehicle.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.velocity.limit(0, this.maxSpeed);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Vehicle.prototype.run = function (context) {
  this.move();
  this.draw(context);
};

Vehicle.prototype.check_edges = function (box) {
  if (this.position.x < box.x.min - this.radius) this.position.x = box.x.max;
  if (box.x.max + this.radius < this.position.x) this.position.x = box.x.min;
  if (this.position.y < box.y.min - this.radius) this.position.y = box.y.max;
  if (box.y.max + this.radius < this.position.y) this.position.y = box.y.min;
};

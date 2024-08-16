import dist from "../utils/dist.js";
import get_closest_point from "../utils/get_closest_point.js";
import get_normal from "../utils/get_normal.js";
import is_between from "../utils/is_between.js";
import Vector from "./Vector.js";

export default function Vehicle(
  position,
  width,
  height,
  mass,
  maxSpeed,
  maxForce,
  color
) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.width = width;
  this.height = height;
  this.mass = mass;
  this.color = color;
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.seek = function (target) {
  const desired = Vector.sub(target, this.position);

  desired.limit(0, this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  this.apply_force(force);
};

Vehicle.prototype.follow = function (path) {
  const future = this.velocity.clone().set_size(25).add(this.position);
  let target, normal, minDist;

  minDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < path.points.length - 1; i++) {
    const a = path.points[i];
    const b = path.points[i + 1];
    let newNormal;

    newNormal = get_normal(future, a, b);

    if (!is_between(newNormal, a, b))
      newNormal = get_closest_point(future, a, b);

    const distance = dist(future, newNormal);

    if (distance < minDist) {
      const dir = Vector.sub(b, a).set_size(10);

      minDist = distance;
      normal = newNormal;
      target = newNormal.clone();

      target.add(dir);
    }
  }

  if (minDist > path.radius && target) {
    this.seek(target);
  }
};

Vehicle.prototype.draw = function (context) {
  context.beginPath();
  context.lineWidth = 1;
  context.fillStyle = this.color;
  context.strokeStyle = "black";
  context.translate(this.position.x, this.position.y);
  context.rotate(this.velocity.angle());
  context.moveTo(-this.width / 2, -this.height / 2);
  context.lineTo(this.width / 2, 0);
  context.lineTo(-this.width / 2, this.height / 2);
  context.lineTo(-this.width / 2, -this.height / 2);
  context.fill();
  context.stroke();
  context.setTransform(1, 0, 0, 1, 0, 0);
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

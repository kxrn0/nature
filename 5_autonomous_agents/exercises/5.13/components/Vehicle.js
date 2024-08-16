import dist from "../utils/dist.js";
import get_closest_point from "../utils/get_closest_point.js";
import get_normal from "../utils/get_normal.js";
import is_between from "../utils/is_between.js";
import Vector from "./Vector.js";

export default function Vehicle(
  position,
  radius,
  mass,
  color,
  maxSpeed,
  maxForce,
  showDebug
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
  this.debugInfo = {
    showDebug,
    isSeeking: false,
    future: new Vector(0, 0),
    normal: new Vector(0, 0),
    target: new Vector(0, 0),
  };
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
  if (this.debugInfo.showDebug) {
    const radius = 5;
    const width = 2;
    const color = this.debugInfo.isSeeking ? "red" : "gray";

    context.fillStyle = color;
    context.strokeStyle = color;
    context.lineWidth = width;

    context.beginPath();
    context.arc(
      this.debugInfo.future.x,
      this.debugInfo.future.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    context.beginPath();
    context.arc(
      this.debugInfo.normal.x,
      this.debugInfo.normal.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    context.beginPath();
    context.arc(
      this.debugInfo.target.x,
      this.debugInfo.target.y,
      radius,
      0,
      Math.PI * 2
    );
    context.fill();

    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.debugInfo.future.x, this.debugInfo.future.y);
    context.lineTo(this.debugInfo.normal.x, this.debugInfo.normal.y);
    context.lineTo(this.debugInfo.target.x, this.debugInfo.target.y);
    context.stroke();

    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.arc(this.position.x, this.position.y, this.maxDist, 0, Math.PI * 2);
    context.stroke();
  }

  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();
};

Vehicle.prototype.seek = function (target) {
  const desired = Vector.sub(target, this.position);

  desired.set_size(this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  this.apply_force(force);
};

Vehicle.prototype.follow = function (path) {
  const future = this.velocity.clone().set_size(25).add(this.position);
  let target, minDist;

  minDist = Number.POSITIVE_INFINITY;

  if (this.debugInfo.showDebug) this.debugInfo.future.copy(future);

  for (let i = 0; i < path.points.length - 1; i++) {
    const j = (i + 1) % path.points.length;
    const a = path.points[i];
    const b = path.points[j];
    let normalPoint, dir;

    normalPoint = get_normal(future, a, b);

    if (!is_between(normalPoint, a, b))
      normalPoint = get_closest_point(future, a, b);

    const distance = dist(future, normalPoint);

    if (distance < minDist) {
      dir = Vector.sub(b, a).set_size(25);

      minDist = distance;
      target = normalPoint.clone();
      target.add(dir);

      if (this.debugInfo.showDebug) {
        this.debugInfo.normal.copy(normalPoint);
        this.debugInfo.target.copy(target);
      }
    }
  }

  if (minDist > path.radius && target) {
    this.seek(target);

    if (this.debugInfo.showDebug) this.debugInfo.isSeeking = true;
  } else if (this.debugInfo.showDebug) this.debugInfo.isSeeking = false;
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

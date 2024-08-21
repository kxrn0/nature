import is_point_in_sector from "../utils/is_point_in_sector.js";
import dist from "../utils/dist.js";
import Vector from "./Vector.js";

export default function Vehicle(
  position,
  width,
  height,
  mass,
  color,
  maxSpeed,
  maxForce,
  visionDistance,
  visionSpan,
  showDebug
) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.mass = mass;
  this.color = color;
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.vision = {
    radius: visionDistance,
    angle: { span: visionSpan, start: 0, end: visionSpan },
  };
  this.showDebug = showDebug;
  this.personalSpace = 3 * Math.max(width, height);

  this.update_vision();
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.check_edges = function (box) {
  const radius = Math.max(this.width, this.height) / 2;

  if (this.position.x < -radius) this.position.x = box.x.max + radius;
  if (box.x.max + radius < this.position.x) this.position.x = -radius;
  if (this.position.y < -radius) this.position.y = box.y.max + radius;
  if (box.y.max + radius < this.position.y) this.position.y = -radius;
};

Vehicle.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.velocity.limit(0, this.maxSpeed);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Vehicle.prototype.compute_seek = function (target) {
  const desired = Vector.sub(target, this.position);

  desired.set_size(this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  return force;
};

Vehicle.prototype.compute_flee = function (target) {
  const force = this.compute_seek(target);

  force.scale(-1);

  return force;
};

Vehicle.prototype.compute_separation = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    if (this === other) continue;

    const isInFov = this.can_see(other.position);

    if (!isInFov) continue;

    const distance = Math.max(dist(this.position, other.position), 1);

    if (distance <= this.personalSpace) {
      const diff = Vector.sub(this.position, other.position);

      diff.scale(1 / distance);

      sum.add(diff);
      count++;
    }
  }

  if (count) {
    sum.set_size(this.maxSpeed);

    const force = Vector.sub(sum, this.velocity);

    force.limit(0, this.maxForce);

    return force;
  }

  return null;
};

Vehicle.prototype.compute_alignment = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    if (this === other) continue;

    const isInFov = this.can_see(other.position);

    if (!isInFov) continue;

    sum.add(other.velocity);

    count++;
  }

  if (count) {
    sum.set_size(this.maxSpeed);

    const force = Vector.sub(sum, this.velocity);

    force.limit(0, this.maxForce);

    return force;
  }

  return null;
};

Vehicle.prototype.compute_cohesion = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;
  for (let other of others) {
    if (this === other) continue;

    const isInFov = this.can_see(other);

    if (!isInFov) continue;

    sum.add(other.position);
    count++;
  }

  if (count) {
    sum.scale(1 / count);

    const force = this.compute_seek(sum);

    return force;
  }

  return null;
};

Vehicle.prototype.can_see = function (target) {
  return is_point_in_sector(
    target,
    this.position,
    this.vision.radius,
    this.vision.angle.start,
    this.vision.angle.end
  );
};

Vehicle.prototype.update_vision = function () {
  const angle = this.velocity.angle();
  const span2 = this.vision.angle.span / 2;

  this.vision.angle.start = angle - span2;
  this.vision.angle.end = angle + span2;
};

Vehicle.prototype.draw = function (context) {
  if (this.showDebug) {
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.fillStyle = "#1199ee55";
    context.arc(
      this.position.x,
      this.position.y,
      this.vision.radius,
      this.vision.angle.start,
      this.vision.angle.end
    );
    context.moveTo(this.position.x, this.position.y);
    context.fill();

    context.beginPath();
    context.fillStyle = "black";
    context.arc(
      this.position.x,
      this.position.y,
      this.personalSpace,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

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

Vehicle.prototype.run = function (context, avoidables, box) {
  const separation = this.compute_separation(avoidables);
  const alignment = this.compute_alignment(avoidables);
  const cohesion = this.compute_cohesion(avoidables);

  if (separation) this.apply_force(separation);

  if (alignment) this.apply_force(alignment);

  if (cohesion) this.apply_force(cohesion);

  this.move();
  this.check_edges(box);
  this.update_vision();
  this.draw(context);
};

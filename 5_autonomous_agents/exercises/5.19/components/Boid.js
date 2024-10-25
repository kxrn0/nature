import dist from "../utils/dist.js";
import are_circles_intersecting from "../utils/are_circles_intersecting.js";
import is_point_in_circle from "../utils/is_point_in_circle.js";
import stroke_circle from "../utils/stroke_circle.js";
import Vector from "./Vector.js";

export default function Boid(
  position,
  width,
  height,
  maxSpeed,
  maxForce,
  separationRadius,
  neighboringRadius,
  separationWeight,
  alignmentWeight,
  cohesionWeight,
  color,
  showDebug
) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.mass = width * height;
  this.color = color;
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.separationRadius = separationRadius;
  this.neighboringRadius = neighboringRadius;
  this.separationWeight = separationWeight;
  this.alignmentWeight = alignmentWeight;
  this.cohesionWeight = cohesionWeight;
  this.showDebug = showDebug;
}

Boid.prototype.set_parameters = function (config) {
  this.width = config[0];
  this.height = config[1];
  this.maxSpeed = config[2];
  this.maxForce = config[3];
  this.separationRadius = config[4];
  this.neighboringRadius = config[5];
  this.separationWeight = config[6];
  this.alignmentWeight = config[7];
  this.cohesionWeight = config[8];
  this.color = config[9];
  this.showDebug = config[10];
};

Boid.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Boid.prototype.check_edges = function (box) {
  const radius = Math.max(this.width, this.height) / 2;

  if (this.position.x < -radius) this.position.x = box.x.max + radius;
  if (box.x.max + radius < this.position.x) this.position.x = -radius;
  if (this.position.y < -radius) this.position.y = box.y.max + radius;
  if (box.y.max + radius < this.position.y) this.position.y = -radius;
};

Boid.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.velocity.limit(0, this.maxSpeed);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Boid.prototype.compute_seek = function (target) {
  const desired = Vector.sub(target, this.position);

  desired.set_size(this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  return force;
};

Boid.prototype.compute_flee = function (target) {
  const force = this.compute_seek(target);

  force.scale(-1);

  return force;
};

Boid.prototype.compute_separation = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    if (this === other) continue;

    const a = { center: this.position, radius: this.separationRadius };
    const b = { center: other.position, radius: other.separationRadius };
    const areIntersecting = are_circles_intersecting(a, b);

    if (!areIntersecting) continue;

    const distance = dist(this.position, other.position) || 1;
    const diff = Vector.sub(this.position, other.position);

    diff.set_size(1 / distance);

    sum.add(diff);
    count++;
  }

  if (count) {
    sum.set_size(this.maxSpeed);

    const force = Vector.sub(sum, this.velocity);

    force.limit(0, this.maxForce);

    return force;
  }

  return new Vector(0, 0);
};

Boid.prototype.compute_alignment = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    if (this === other) continue;

    const point = other.position;
    const circle = { center: this.position, radius: this.neighboringRadius };
    const isVisible = is_point_in_circle(point, circle);

    if (!isVisible) continue;

    sum.add(other.velocity);

    count++;
  }

  if (count) {
    sum.set_size(this.maxSpeed);

    const force = Vector.sub(sum, this.velocity);

    force.limit(0, this.maxForce);

    return force;
  }

  return new Vector(0, 0);
};

Boid.prototype.compute_cohesion = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    if (this === other) continue;

    const point = other.position;
    const circle = { center: this.position, radius: this.neighboringRadius };
    const isVisible = is_point_in_circle(point, circle);

    if (!isVisible) continue;

    sum.add(other.position);
    count++;
  }

  if (count) {
    sum.scale(1 / count);

    const force = this.compute_seek(sum);

    return force;
  }

  return new Vector(0, 0);
};

Boid.prototype.draw = function (context) {
  if (this.showDebug) {
    stroke_circle(context, this.position, this.separationRadius, 2, "black");
    stroke_circle(context, this.position, this.neighboringRadius, 1, "black");
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

Boid.prototype.run = function (context, others, obstacles, box) {
  const separation = this.compute_separation(others);
  const alignment = this.compute_alignment(others);
  const cohesion = this.compute_cohesion(others);
  const flee = obstacles.reduce((total, other) => {
    if (other === this) return total;

    const force = this.compute_flee(other);

    total.add(force);

    return total;
  }, new Vector(0, 0));

  separation.scale(this.separationWeight);
  alignment.scale(this.alignmentWeight);
  cohesion.scale(this.cohesionWeight);
  flee.scale(this.separationWeight);

  this.apply_force(separation);
  this.apply_force(alignment);
  this.apply_force(cohesion);
  this.apply_force(flee);

  this.move();
  this.check_edges(box);
  this.draw(context);
};

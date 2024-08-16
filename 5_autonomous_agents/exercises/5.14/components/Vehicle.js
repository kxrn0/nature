import dist from "../utils/dist.js";
import Vector from "./Vector.js";
import random from "../utils/random.js";
import is_point_in_triangle from "../utils/is_point_in_triangle.js";
import is_point_in_circle from "../utils/is_point_in_circle.js";
import fun from "../utils/fun.js";
import random_rgb from "../utils/random_rgb.js";

export default function Vehicle(
  position,
  width,
  height,
  mass,
  color,
  maxSpeed,
  maxForce,
  maxHealth,
  dh,
  showDebug
) {
  this.position = position;
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.mass = mass;
  this.color = color;
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.personalSpace = 2 * Math.max(width, height);
  this.maxHealth = maxHealth;
  this.health = maxHealth;
  this.dh = dh;
  this.showDebug = showDebug;
  this.wanderInfo = {
    wanderAngle: 0,
    wanderRadius: Math.min(width, height),
    future: new Vector(0, 0),
    target: new Vector(0, 0),
  };
  this.vision = {
    edgeLength: 300,
    angle: Math.PI / 2,
    vertices: [new Vector(0, 0), new Vector(0, 0), new Vector(0, 0)],
  };
  this.c = 1;
  this.cycle = 0;
  this.maxCycles = 1000;

  this.update_vision();
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.seek = function (target, factor) {
  const desired = Vector.sub(target, this.position);

  desired.set_size(this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);
  force.scale(factor);

  this.apply_force(force);
};

Vehicle.prototype.separate = function (others) {
  const sum = new Vector(0, 0);
  let count;

  count = 0;

  for (let other of others) {
    const isInFov = is_point_in_triangle(
      other.position,
      ...this.vision.vertices
    );

    if (other === this || !isInFov) continue;

    const distance = Math.max(dist(this.position, other.position), 1);

    if (distance <= this.personalSpace * 2) {
      const diff = Vector.sub(this.position, other.position);

      diff.scale(1 / distance);

      sum.add(diff);
      count++;
    }
  }

  if (count) {
    sum.set_size(this.maxSpeed * this.c);

    const steer = Vector.sub(sum, this.velocity);

    steer.limit(0, this.maxForce);

    this.apply_force(steer);
  }
};

Vehicle.prototype.wander = function () {
  const step = this.velocity.clone().set_size(this.personalSpace);
  const targetStep = Vector.from_angle(
    this.wanderInfo.wanderAngle,
    this.wanderInfo.wanderRadius
  );

  this.wanderInfo.future.copy(this.position.clone().add(step));
  this.wanderInfo.target.copy(this.wanderInfo.future.clone().add(targetStep));

  this.seek(this.wanderInfo.target, this.c);

  this.wanderInfo.wanderAngle += random(-0.5, 0.5);
};

Vehicle.prototype.look_for_food = function (foodStuff) {
  const deficit = this.maxHealth - this.health;
  const visible = foodStuff.filter((item) => {
    const isWorthIt = item.energy >= 0.1 * deficit;
    const isVisible = is_point_in_triangle(
      item.position,
      ...this.vision.vertices
    );

    return isWorthIt && isVisible;
  });
  const closest = visible.reduce(
    (target, current) => {
      const distance = dist(this.position, current.position);

      if (distance < target.distance) target = { item: current, distance };

      return target;
    },
    { item: null, distance: Number.POSITIVE_INFINITY }
  ).item;

  if (!closest) {
    this.c = 1;
    return;
  }

  if (is_point_in_circle(this.position, closest)) {
    this.health = Math.min(this.health + closest.energy, this.maxHealth);
    closest.energy -= deficit;

    if (closest.energy <= 0) {
      const index = foodStuff.findIndex((item) => item === closest);

      if (index === -1) throw new Error("sxaron!");

      foodStuff.splice(index, 1);
    }

    this.c = 1;
  } else {
    this.seek(closest.position, 1);

    if (this.health < this.maxHealth * 0.75) this.c = 0.5;
  }
};

Vehicle.prototype.update_vision = function () {
  const angle = this.velocity.angle();

  const direction = Vector.from_angle(angle, 1);
  const v1 = this.position.clone().add(direction);
  const v2 = Vector.from_angle(
    angle + this.vision.angle / 2,
    this.vision.edgeLength
  ).add(v1);
  const v3 = Vector.from_angle(
    angle - this.vision.angle / 2,
    this.vision.edgeLength
  ).add(v1);

  this.vision.vertices[0] = v1;
  this.vision.vertices[1] = v2;
  this.vision.vertices[2] = v3;
};

Vehicle.prototype.check_edges = function (box) {
  const radius = Math.max(this.width, this.height);

  if (this.position.x < radius) this.position.x = radius;
  if (box.x.max - radius < this.position.x)
    this.position.x = box.x.max - radius;
  if (this.position.y < radius) this.position.y = radius;
  if (box.y.max - radius < this.position.y)
    this.position.y = box.y.max - radius;
};

Vehicle.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.velocity.limit(0, this.maxSpeed);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Vehicle.prototype.draw = function (context) {
  const health = `${((100 * this.health) / this.maxHealth).toFixed(2)}%`;

  context.strokeStyle = "black";
  context.lineWidth = 1;

  if (this.showDebug) {
    const [v1, v2, v3] = this.vision.vertices;

    context.beginPath();
    context.fillStyle = "#ffe26e55";
    context.moveTo(v1.x, v1.y);
    context.lineTo(v2.x, v2.y);
    context.lineTo(v3.x, v3.y);
    context.fill();

    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.wanderInfo.future.x, this.wanderInfo.future.y);
    context.lineTo(this.wanderInfo.target.x, this.wanderInfo.target.y);
    context.stroke();

    context.beginPath();
    context.arc(
      this.wanderInfo.future.x,
      this.wanderInfo.future.y,
      this.wanderInfo.wanderRadius,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.personalSpace,
      0,
      Math.PI * 2
    );
    context.stroke();

    context.fillStyle = "black";
    context.fillText(
      health,
      this.position.x,
      this.position.y - 3 * Math.max(this.width, this.height)
    );
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

Vehicle.prototype.reproduce = function () {
  if (this.cycle <= this.maxCycles) return;

  this.cycle = 0;

  if (this.health < 0.2 * this.maxHealth) return null;

  const p = 0.1;
  let width, height, mass, color, maxSpeed, maxForce, maxHealth, dh;

  if (random(0, 100) < 10) {
    width = fun(this.width, p);
    height = fun(this.height, p);
    mass = width + height;
    color = random_rgb();
    maxSpeed = fun(this.maxSpeed, p);
    maxForce = fun(this.maxForce, p);
    maxHealth = fun(this.maxHealth, p);
    dh = fun(this.dh, p);
  } else {
    width = this.width;
    height = this.height;
    mass = this.mass;
    color = this.color;
    maxSpeed = this.maxSpeed;
    maxForce = this.maxForce;
    maxHealth = this.maxHealth;
    dh = this.dh;
  }

  const v = new Vehicle(
    this.position.clone(),
    width,
    height,
    mass,
    color,
    maxSpeed,
    maxForce,
    maxHealth,
    dh,
    this.showDebug
  );
  const health = this.health * 0.2;

  v.health = health;
  this.health -= health;

  return v;
};

Vehicle.prototype.run = function (context, others, foodStuff, box) {
  if (this.health <= 0) return;

  this.wander();
  this.separate(others);
  this.look_for_food(foodStuff);
  this.move();
  this.check_edges(box);
  this.update_vision();
  this.draw(context);

  this.health -= this.dh;
  this.cycle++;

  return this.reproduce();
};

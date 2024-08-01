import Vector from "./Vector.js";

export default function Vehicle(
  position,
  radius,
  maxSpeed,
  maxForce,
  color,
  isConstrained,
  box
) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.radius = radius;
  this.color = color;
  this.isConstrained = isConstrained;
  this.box = box;
}

Vehicle.prototype.apply_force = function (force) {
  this.acceleration.add(force);
};

Vehicle.prototype.follow = function (flow) {
  const desired = flow.retrieve(this.position);

  if (!desired) return;

  desired.set_size(this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  this.apply_force(force);
};

Vehicle.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();
};

Vehicle.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.velocity.limit(0, this.maxSpeed);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Vehicle.prototype.stay_in_box = function (box) {
  if (this.position.x < box.x.min) this.position.x = box.x.max;
  if (this.position.x > box.x.max) this.position.x = box.x.min;
  if (this.position.y < box.y.min) this.position.y = box.y.max;
  if (this.position.y > box.y.max) this.position.y = box.y.min;
};

Vehicle.prototype.run = function (context) {
  this.move();

  if (this.isConstrained) this.stay_in_box(this.box);

  this.draw(context);
};

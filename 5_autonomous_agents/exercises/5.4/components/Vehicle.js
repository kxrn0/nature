function Vehicle(position, width, height, mass, maxSpeed, color) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.mass = mass;
  this.color = color;
  this.maxSpeed = maxSpeed;
  this.maxForce = mass / 10;
  this.deterrents = [];
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.check_deterrents = function (deterrents) {
  this.deterrents = deterrents.filter((deterrent) =>
    is_point_in_rect(this.position, deterrent)
  );
};

Vehicle.prototype.draw = function (context) {
  context.beginPath();
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

Vehicle.prototype.compute_force = function (target) {
  const speedLimit =
    this.maxSpeed *
    this.deterrents.reduce((total, deterrent) => total * deterrent.u, 1);
  const forceLimit =
    this.maxForce *
    this.deterrents.reduce((total, deterrent) => total * deterrent.u, 1);

  const desired = Vector.sub(target.position, this.position);

  desired.limit(0, speedLimit);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, forceLimit);

  return force;
};

Vehicle.prototype.seek = function (target) {
  const force = this.compute_force(target);

  this.apply_force(force);
};

Vehicle.prototype.flee = function (target) {
  const force = this.compute_force(target);

  force.scale(-1);

  this.apply_force(force);
};

Vehicle.prototype.chase = function (target) {
  const futurePosition = Vector.add(
    target.position,
    target.velocity.clone().scale(5)
  );
  const newTarget = { position: futurePosition };
  const force = this.compute_force(newTarget);

  this.apply_force(force);
};

Vehicle.prototype.contact = function () {
  const friction = this.velocity
    .clone()
    .scale(-this.deterrents.reduce((total, current) => total * current.u, 1));

  this.apply_force(friction);
};

Vehicle.prototype.move = function () {
  this.velocity.add(this.acceleration);

  this.contact();

  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Vehicle.prototype.run = function (context) {
  this.move();
  this.draw(context);
};

function Wanderer(
  position,
  width,
  height,
  wanderRadius,
  lookAhead,
  maxSpeed,
  maxForce,
  color
) {
  this.position = position;
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.maxSpeed = maxSpeed;
  this.maxForce = maxForce;
  this.width = width;
  this.height = height;
  this.color = color;
  this.futurePosition = new Vector(0, 0);
  this.targetPosition = new Vector(0, 0);
  this.wanderRadius = wanderRadius;
  this.lookAhead = lookAhead;
  this.wanderAngle = 0;
}

Wanderer.prototype.compute_force = function (targetPosition) {
  const desired = Vector.sub(targetPosition, this.position);

  desired.limit(0, this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  return force;
};

Wanderer.prototype.apply_force = function (force) {
  this.acceleration.add(force);
};

Wanderer.prototype.seek = function (targetPosition) {
  const force = this.compute_force(targetPosition);

  this.apply_force(force);
};

Wanderer.prototype.flee = function (targetPosition) {
  const force = this.compute_force(targetPosition);

  force.scale(-1);

  this.apply_force(force);
};

Wanderer.prototype.draw = function (context) {
  context.beginPath();
  context.strokeStyle = "black";
  context.moveTo(this.position.x, this.position.y);
  context.lineTo(this.futurePosition.x, this.futurePosition.y);
  context.lineTo(this.targetPosition.x, this.targetPosition.y);
  context.stroke();
  context.beginPath();
  context.arc(
    this.futurePosition.x,
    this.futurePosition.y,
    this.wanderRadius,
    0,
    Math.PI * 2
  );
  context.stroke();

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

Wanderer.prototype.wander = function () {
  const step = Vector.from_angle(this.velocity.angle(), this.lookAhead);
  const targetStep = Vector.from_angle(this.wanderAngle, this.wanderRadius);

  this.futurePosition = this.position.clone().add(step);
  this.targetPosition = this.futurePosition.clone().add(targetStep);

  this.seek(this.targetPosition);
  this.wanderAngle += random(-0.5, 0.5);
};

Wanderer.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Wanderer.prototype.run = function (context) {
  this.wander();
  this.move();
  this.draw(context);
};

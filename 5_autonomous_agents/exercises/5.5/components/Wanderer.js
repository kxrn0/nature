function Wanderer(
  position,
  width,
  height,
  mass,
  wanderRadius,
  lookAhead,
  maxSpeed,
  maxForce,
  color,
  showDebug
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
  this.futurePosition = new Vector(0, 0);
  this.targetPosition = new Vector(0, 0);
  this.wanderRadius = wanderRadius;
  this.lookAhead = lookAhead;
  this.wanderAngle = 0;
  this.avoidRadius = lookAhead + 2 * wanderRadius;
  this.showDebug = showDebug;
}

Wanderer.prototype.compute_force = function (targetPosition) {
  const desired = Vector.sub(targetPosition, this.position);

  desired.limit(0, this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  return force;
};

Wanderer.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Wanderer.prototype.seek = function (targetPosition) {
  const force = this.compute_force(targetPosition);

  this.apply_force(force);
};

Wanderer.prototype.flee = function (targetPosition) {
  const force = this.compute_force(targetPosition);

  force.scale(-5);

  this.apply_force(force);
};

Wanderer.prototype.draw = function (context) {
  context.lineWidth = 1;

  if (this.showDebug) {
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
    context.arc(
      this.position.x,
      this.position.y,
      this.avoidRadius,
      0,
      Math.PI * 2
    );
    context.stroke();
  }

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
  this.velocity.limit(0, this.maxSpeed);
  this.velocity.scale(Wanderer.drag);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Wanderer.prototype.run = function (context) {
  this.move();
  this.draw(context);
};

Wanderer.prototype.avoid_peer = function (other) {
  const ball1 = { center: this.position, radius: this.avoidRadius };
  const ball2 = { center: other.position, radius: other.avoidRadius };

  if (balls_touch(ball1, ball2)) this.flee(other.position);
};

Wanderer.prototype.stay_in_box = function (box) {
  if (this.position.x < box.x.min) this.position.x = box.x.max;
  if (this.position.x > box.x.max) this.position.x = box.x.min;
  if (this.position.y < box.y.min) this.position.y = box.y.max;
  if (this.position.y > box.y.max) this.position.y = box.y.min;
};

Wanderer.prototype.avoid_wall = function (wall) {
  const corners = find_corners(wall, this.avoidRadius * 2);
  const isIn = is_point_in_rect(corners, this.position);

  if (!isIn) return;

  const closest = find_closest_point(wall, this.avoidRadius * 2, this.position);
  const desired = Vector.from_segment(closest, this.position);
  const size = map(desired.size(), this.avoidRadius, 0, 0, this.maxSpeed);

  desired.set_size(size).scale(this.mass);

  const force = Vector.sub(desired, this.velocity);

  this.apply_force(force);
};

Wanderer.drag = 0.99;

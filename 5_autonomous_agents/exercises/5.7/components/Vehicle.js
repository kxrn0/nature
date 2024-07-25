function Vehicle(
  position,
  width,
  height,
  mass,
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
  this.width = width;
  this.height = height;
  this.mass = mass;
  this.color = color;
  this.isConstrained = isConstrained;
  this.box = box;
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.follow = function (flow) {
  const desired = flow.look(this.position).clone();

  desired.set_size(this.maxSpeed);

  const force = Vector.sub(desired, this.velocity);

  force.limit(0, this.maxForce);

  this.apply_force(force);
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

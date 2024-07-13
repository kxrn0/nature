function Vehicle(position, width, height, mass, maxSpeed, color) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.mass = mass;
  this.color = color;
  this.maxSpeed = maxSpeed;
  this.maxForce = mass;
}

Vehicle.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Vehicle.prototype.draw = function (context) {
  const perimeter = 2 * this.width + 2 * this.height;
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
  context.beginPath();
  context.arc(this.position.x, this.position.y, perimeter, 0, Math.PI * 2);
  context.stroke();
};

Vehicle.prototype.arrive = function (target) {
  const desired = Vector.sub(target.position, this.position);
  const distance = desired.size();
  const perimeter = 2 * this.width + 2 * this.height;

  if (distance < perimeter) {
    const mag = map(distance, 0, perimeter, 0, this.maxSpeed);

    desired.set_size(mag);
  } else desired.set_size(this.maxSpeed);

  const steer = Vector.sub(desired, this.velocity);

  steer.limit(0, this.maxForce);

  this.apply_force(steer);
};

Vehicle.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Vehicle.prototype.run = function (context) {
  this.move();
  this.draw(context);
};

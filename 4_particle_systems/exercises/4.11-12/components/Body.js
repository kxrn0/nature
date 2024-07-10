function Body(position, mass) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.mass = mass;
}

Body.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Body.prototype.repel = function (other) {
  const force = Vector.sub(this.position, other.position);
  const mag = constrain(force.size(), 1, 100);
  const strength = (-1 * this.mass * other.mass) / (50 * mag * mag);

  force.set_size(strength);

  other.apply_force(force);
};

Body.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

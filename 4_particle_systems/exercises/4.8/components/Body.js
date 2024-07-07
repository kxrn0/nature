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

Body.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

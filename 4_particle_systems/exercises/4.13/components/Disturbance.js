function Disturbance(position, strength, direction, color, radius) {
  this.position = position;
  this.strength = strength;
  this.direction = direction;
  this.color = color;
  this.radius = radius;
}

Disturbance.prototype.disturb = function (particle) {
  const force = Vector.sub(this.position, particle.body.position);
  const mag = constrain(force.size(), 1, 1000);
  const strength = (this.direction * this.strength) / (mag * mag);

  force.set_size(strength);

  particle.apply_force(force);
};

Disturbance.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();
};

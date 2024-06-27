function Particle(position, angle, lifeSpan, decayRate, color, size, mass) {
  Body.call(this, position, angle, mass);

  this.lifeSpan = lifeSpan;
  this.lifeForce = lifeSpan;
  this.decayRate = decayRate;
  this.color = color;
  this.size = size;
}

Object.setPrototypeOf(Particle.prototype, Body.prototype);

Particle.prototype.is_dead = function () {
  return this.lifeForce <= 0;
};

Particle.prototype.draw = function (context) {
  if (this.is_dead()) return;

  context.beginPath();
  context.fillStyle = this.color;
  context.globalAlpha = map(this.lifeForce, 0, this.lifeSpan, 0, 1);
  context.translate(this.position.x, this.position.y);
  context.rotate(this.angle);
  context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
  context.globalAlpha = 1;
  context.setTransform(1, 0, 0, 1, 0, 0);
};

Particle.prototype.move = function () {
  if (this.is_dead()) return;

  Body.prototype.move.call(this);

  this.lifeForce -= this.decayRate;
};

Particle.prototype.run = function (context, force) {
  if (force) this.apply_force(force);

  this.move();
  this.draw(context);
};

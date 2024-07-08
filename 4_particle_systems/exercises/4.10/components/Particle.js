function Particle(body, lifeSpan, decayRate) {
  this.body = body;
  this.lifeSpan = lifeSpan;
  this.lifeForce = lifeSpan;
  this.decayRate = decayRate;
}

Particle.prototype.is_dead = function () {
  return this.lifeForce <= 0;
};

Particle.prototype.run = function (context) {
  if (this.is_dead()) return;

  context.globalAlpha = map(this.lifeForce, 0, this.lifeSpan, 0, 1);
  this.body.run(context);
  context.globalAlpha = 1;
  this.lifeForce -= this.decayRate;
};

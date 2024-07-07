function ParticleSystem(
  origin,
  factories,
  minLifeSpan,
  maxLifeSpan,
  minDecay,
  maxDecay,
  strength
) {
  this.origin = origin.clone();
  this.factories = factories;
  this.particles = [];
  this.minLifeSpan = minLifeSpan;
  this.maxLifeSpan = maxLifeSpan;
  this.minDecay = minDecay;
  this.maxDecay = maxDecay;
  this.strength = strength;
  this.isOn = false;
}

ParticleSystem.prototype.is_empty = function () {
  return this.particles.length == 0;
};

ParticleSystem.prototype.turn_on = function () {
  this.isOn = true;
};

ParticleSystem.prototype.turn_off = function () {
  this.isOn = false;
};

ParticleSystem.prototype.add_particle = function () {
  const index = ~~(Math.random() * this.factories.length);
  const body = this.factories[index](this.origin);
  const lifeSpan = random(this.minLifeSpan, this.maxLifeSpan);
  const decayRate = random(this.minDecay, this.maxDecay);
  const particle = new Particle(body, lifeSpan, decayRate);
  const force = Vector.random(this.strength);

  body.apply_force(force);

  this.particles.push(particle);
};

ParticleSystem.prototype.run = function (context, force) {
  if (this.isOn) this.add_particle();

  for (let i = this.particles.length - 1; i >= 0; i--) {
    this.particles[i].run(context, force);

    if (this.particles[i].is_dead()) this.particles.splice(i, 1);
  }
};

function ParticleSystem(
  origin,
  minLifeSpan,
  maxLifeSpan,
  minDecay,
  maxDecay,
  push
) {
  this.origin = origin.clone();
  this.particles = [];
  this.minLifeSpan = minLifeSpan;
  this.maxLifeSpan = maxLifeSpan;
  this.minDecay = minDecay;
  this.maxDecay = maxDecay;
  this.push = push;
  this.isOn = true;
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
  const width = random(5, 15);
  const height = random(5, 15);
  const shade = random(0, 255);
  const color = random_rgb();
  const body = new Square(this.origin, width, height, color);
  const lifeSpan = random(this.minLifeSpan, this.maxLifeSpan);
  const decayRate = random(this.minDecay, this.maxDecay);
  const particle = new Particle(body, lifeSpan, decayRate);
  const force = Vector.random(this.push);

  body.apply_force(force);

  this.particles.push(particle);
};

ParticleSystem.prototype.apply_force = function (force) {
  for (let particle of this.particles) particle.body.apply_force(force);
};

ParticleSystem.prototype.interact_with_other = function (particles) {
  for (let particle of this.particles)
    for (let other of particles) {
      if (particle !== other) particle.body.repel(other.body);
    }
};

ParticleSystem.prototype.run = function (context) {
  if (this.isOn) this.add_particle();

  this.interact_with_other(this.particles);

  for (let i = this.particles.length - 1; i >= 0; i--) {
    this.particles[i].run(context);

    if (this.particles[i].is_dead()) this.particles.splice(i, 1);
  }
};

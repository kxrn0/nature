function ParticleSystem(
  origin,
  minLifeSpan,
  maxLifeSpan,
  minDecay,
  maxDecay,
  strength
) {
  this.origin = origin.clone();
  this.particles = [];
  this.minLifeSpan = minLifeSpan;
  this.maxLifeSpan = maxLifeSpan;
  this.minDecay = minDecay;
  this.maxDecay = maxDecay;
  this.strength = strength;

  this.is_empty = function () {
    return this.particles.length == 0;
  };

  this.add_particles = function (bodies) {
    for (let body of bodies) {
      const lifeSpan = random(this.minLifeSpan, this.maxLifeSpan);
      const decayRate = random(this.minDecay, this.maxDecay);
      const particle = new Particle(body, lifeSpan, decayRate);
      const force = Vector.random(this.strength);

      body.apply_force(force);

      this.particles.push(particle);
    }
  };

  this.run = function (context, force) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].run(context, force);

      if (this.particles[i].is_dead()) this.particles.splice(i, 1);
    }
  };
}

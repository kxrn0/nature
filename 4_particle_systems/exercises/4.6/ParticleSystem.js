function ParticleSystem(origin) {
  this.origin = origin.clone();
  this.particles = [];

  this.is_empty = function () {
    return this.particles.length == 0;
  };

  this.add_particles = function (items) {
    for (let item of items) {
      const lifeSpan = random(100, 200);
      const decayRate = random(0.1, 0.5);
      const particle = new Particle(item, lifeSpan, decayRate);

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

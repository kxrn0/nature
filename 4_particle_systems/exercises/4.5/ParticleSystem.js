function ParticleSystem(origin) {
  this.origin = origin.clone();
  this.particles = [];

  this.add_particle = function (lifeSpan, decayRate, color, size, mass, force) {
    const particle = new Particle(
      this.origin,
      0,
      lifeSpan,
      decayRate,
      color,
      size,
      mass
    );

    particle.apply_force(force);

    this.particles.push(particle);
  };

  this.run = function (context, force) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].run(context, force);

      if (this.particles[i].is_dead()) this.particles.splice(i, 1);
    }
  };
}

function Party(origin) {
  this.origin = origin.clone();
  this.particles = [];

  this.add_particle = function (force) {
    const size = random(5, 10);
    const mass = size * 5;
    const lifeSpan = size * 10;
    const decay = size / 10;
    const shade = random(50, 200);
    const color = `rgb(${shade}, ${shade}, ${shade})`;
    const particle = new Particle(
      this.origin,
      lifeSpan,
      decay,
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

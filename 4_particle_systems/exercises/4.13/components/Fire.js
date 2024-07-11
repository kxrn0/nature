function Fire(origin) {
  this.origin = origin;
  this.particles = [];
}

Fire.prototype.apply_force = function (force) {
  for (let particle of this.particles) particle.apply_force(force);
};

Fire.prototype.add_particles = function (n) {
  const width = 43;
  const height = width;
  const mass = width + height;
  const minSpan = 100;
  const maxSpan = 150;
  const minDecay = 0.1;
  const maxDecay = 0.5;

  for (let i = 0; i < n; i++) {
    const body = new Body(this.origin, width, height, mass);
    const lifeSpan = random(minSpan, maxSpan);
    const decayRate = random(minDecay, maxDecay);
    // const decayRate = 0;
    const particle = new Particle(body, lifeSpan, decayRate);
    const fx = get_random_gaussian(0, 0.5);
    const fy = get_random_gaussian(-0.1, 0.05);
    const force = new Vector(fx, fy);

    particle.apply_force(force);

    this.particles.push(particle);
  }
};

Fire.prototype.burn = function (context) {
  for (let particle of this.particles) {
    const force = Vector.random_from_range(-Math.PI, 0, -0.1);

    // particle.apply_force(force);

    particle.run(context);
  }

  this.particles = this.particles.filter((particle) => !particle.is_dead());
};

function Fire(origin) {
  this.origin = origin;
  this.particles = [];
}

Fire.prototype.apply_force = function (force) {
  for (let particle of this.particles) particle.apply_force(force);
};

Fire.prototype.apply_disturbance = function (disturbance) {
  for (let particle of this.particles) disturbance.disturb(particle);
};

Fire.prototype.add_particles = function (n) {
  const width = 25;
  const height = width;
  const mass = width + height;
  const minSpan = 100;
  const maxSpan = 150;
  const minDecay = 0.5;
  const maxDecay = 1;

  for (let i = 0; i < n; i++) {
    const body = new Body(this.origin, width, height, mass);
    const lifeSpan = random(minSpan, maxSpan);
    const decayRate = random(minDecay, maxDecay);
    const particle = new Particle(body, lifeSpan, decayRate);
    Fire.push(particle, 10);

    this.particles.push(particle);
  }
};

Fire.prototype.burn = function (context) {
  for (let particle of this.particles) {
    Fire.push(particle, 2);

    particle.run(context);
  }

  this.particles = this.particles.filter((particle) => !particle.is_dead());
};

Fire.push = function (particle, mag) {
  const x = random(-mag, mag);
  const y = random(0, -mag);
  const force = new Vector(x, y);

  particle.apply_force(force);
};

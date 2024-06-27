function Firework(position, angle, fuel, burnRate, mass, base) {
  Body.call(this, position, angle, mass);

  this.fuel = fuel;
  this.explosionSize = fuel / 2;
  this.burnRate = burnRate;
  this.isIgnited = false;
  this.hasExploded = false;
  this.base = base;
  this.trail = new ParticleSystem(position);
  this.explosion = new ParticleSystem(position);
}

Object.setPrototypeOf(Firework.prototype, Body.prototype);

Firework.prototype.is_dead = function () {
  return (
    this.fuel < 0 &&
    this.hasExploded &&
    this.trail.length === 0 &&
    this.explosion.length === 0
  );
};

Firework.prototype.ignite = function () {
  this.isIgnited = true;
};

Firework.prototype.draw = function (context) {
  if (!this.hasExploded) {
    context.beginPath();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.fillStyle = "purple";
    context.fillRect(-this.base, -this.base / 2, 2 * this.base, this.base);
    context.fillStyle = "yellow";
    context.fillRect(
      (2 * this.base) / 3,
      -this.base / 2,
      this.base / 3,
      this.base
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
};

Firework.prototype.move = function () {
  if (this.hasExploded) return;

  Body.prototype.move.call(this);

  this.trail.origin.copy(this.position);
  this.explosion.origin.copy(this.position);
};

Firework.prototype.thrust = function () {
  const force = Vector.from_angle(this.angle, this.burnRate * 50);

  this.apply_force(force);

  this.fuel -= this.burnRate;
};

Firework.prototype.add_trail_particles = function () {
  const thrust = Vector.from_angle(this.angle + Math.PI, this.burnRate * 10);

  for (let i = 0; i < this.burnRate * 2; i++) {
    const lifeSpan = random(100, 200);
    const decayRate = random(1, 5);
    const shade = random(200, 255);
    const color = `rgb(${shade}, ${shade}, ${shade})`;
    const size = random(1, 5);
    const mass = size;
    const turb = Vector.random(this.burnRate / 10);
    const force = Vector.add(thrust, turb);

    this.trail.add_particle(lifeSpan, decayRate, color, size, mass, force);
  }
};

Firework.prototype.explode = function () {
  for (let i = 0; i < this.explosionSize; i++) {
    const lifeSpan = random(100, 200);
    const decayRate = random(1, 5);
    const color = random_rgb();
    const size = random(5, 10);
    const mass = size;
    const force = Vector.random(this.burnRate * 5);

    this.explosion.add_particle(lifeSpan, decayRate, color, size, mass, force);
  }

  this.hasExploded = true;
};

Firework.prototype.run = function (context, force) {
  if (this.isIgnited && this.fuel >= 0) {
    this.thrust();
    this.add_trail_particles();
  }

  this.trail.run(context, force);

  if (!this.hasExploded && this.fuel < 0) this.explode();

  this.explosion.run(context, force);

  this.apply_force(force);
  this.move();
  this.draw(context);
};

Firework.prototype.apply_force = function (force) {
  this.angularAcceleration = 0;

  Body.prototype.apply_force.call(this, force);
};

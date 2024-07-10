function Fire(corner, width, height) {
  this.corner = corner.clone();
  this.width = Math.max(width, Fire.sprites.big.middle.naturalWidth);
  this.height = Math.max(height, Fire.sprites.big.middle.naturalHeight);
  this.particles = [];
}

Fire.prototype.add_particle = function () {
  const range = {
    x: { min: this.corner.x, max: this.corner.x + this.width },
    y: { min: this.corner.y, max: this.corner.y + this.height },
  };
  const position = Vector.from_range(range);
  const xp = map(position.x, range.x.min, range.x.max, 0, 100);
  const yp = map(position.y, range.y.min, range.y.max, 0, 100);
  const sprite = Fire.choose_sprite(xp, yp);
  const body = new FireParticle(position, sprite, sprite.naturalWidth);
  const lifeSpan = random(100, 150);
  const decayRate = random(1, 5);
  const particle = new Particle(body, lifeSpan, decayRate);
  const mean = Fire.get_push_angle(xp);
  const sd = 30;
  const angle = get_random_gaussian(mean, sd);
  const force = Vector.from_angle(angle);

  particle.apply_force(force);

  this.particles.push(particle);
};

Fire.prototype.apply_force = function (force) {
  for (let particle of this.particles) particle.apply_force(force);
};

Fire.prototype.burn = function (context) {
  for (let i = 0; i < 10; i++) this.add_particle();

  for (let particle of this.particles) {
    particle.apply_force(Fire.up);

    particle.run(context);
  }

  this.particles = this.particles.filter((particle) => !particle.is_dead());
};

Fire.up = new Vector(0, -1);

Fire.sprites = {
  big: { left: null, middle: null, right: null },
  medium: { left: null, middle: null, right: null },
  small: { left: null, middle: null, right: null },
};

Fire.sprites.big.left = document.querySelector("#fire-big-left");
Fire.sprites.big.middle = document.querySelector("#fire-big-middle");
Fire.sprites.big.right = document.querySelector("#fire-big-right");

Fire.sprites.medium.left = document.querySelector("#fire-medium-left");
Fire.sprites.medium.middle = document.querySelector("#fire-medium-middle");
Fire.sprites.medium.right = document.querySelector("#fire-medium-right");

Fire.sprites.small.left = document.querySelector("#fire-small-left");
Fire.sprites.small.middle = document.querySelector("#fire-small-middle");
Fire.sprites.small.right = document.querySelector("#fire-small-right");

Fire.choose_sprite = function (xp, yp) {
  if (xp < 33) {
    if (yp < 33) return Fire.sprites.small.left;
    else if (yp < 66) return Fire.sprites.medium.left;
    else return Fire.sprites.big.left;
  } else if (xp < 66) {
    if (yp < 33) return Fire.sprites.small.middle;
    else if (yp < 66) return Fire.sprites.medium.middle;
    else return Fire.sprites.big.middle;
  } else {
    if (yp < 33) return Fire.sprites.small.right;
    else if (yp < 66) return Fire.sprites.medium.right;
    else return Fire.sprites.big.right;
  }
};

Fire.get_push_angle = function (xp) {
  if (xp < 33) return -150;
  else if (xp < 66) return -90;
  else return -30;
};

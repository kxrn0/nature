function Particle(
  position,
  lifeSpan,
  decay,
  color = "gray",
  size = 15,
  mass = 15
) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.angle = 0;
  this.angularVelocity = 0;
  this.angularAcceleration = 0;
  this.lifeSpan = lifeSpan;
  this.lifeForce = lifeSpan;
  this.decay = decay;
  this.color = color;
  this.size = size;
  this.mass = mass;

  this.draw = function (context) {
    if (this.is_dead()) return;

    context.beginPath();
    context.fillStyle = this.color;
    context.globalAlpha = map(this.lifeForce, 0, this.lifeSpan, 0, 1);
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    context.globalAlpha = 1;
    context.setTransform(1, 0, 0, 1, 0, 0);
  };

  this.move = function () {
    if (this.is_dead()) return;

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.scale(0);
    this.angularVelocity += this.angularAcceleration;
    this.angle += this.angularVelocity;
    this.angularAcceleration = 0;
    this.lifeForce -= this.decay;
  };

  this.apply_force = function (force) {
    force = force.clone().scale(1 / this.mass);

    this.acceleration.add(force);
    this.angularAcceleration += force.x / 10;
  };

  this.run = function (context, force) {
    if (force) this.apply_force(force);

    this.move();
    this.draw(context);
  };

  this.is_dead = function () {
    return this.lifeForce <= 0;
  };
}

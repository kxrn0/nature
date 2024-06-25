function Car(position, orientation, width, height) {
  const topOrigin = new Vector(position.x - width / 2, position.y - height / 3);
  const bottomOrigin = new Vector(
    position.x - width / 2,
    position.y + height / 3
  );

  this.position = position;
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.orientation = orientation;
  this.isRunning = false;
  this.turnDirection = 0;
  this.topExhaust = new Party(topOrigin);
  this.bottomExhaust = new Party(bottomOrigin);

  this.thrust = function () {
    const force = Vector.from_angle(this.orientation).scale(Car.forceMag);

    this.acceleration.add(force);

    force.scale(-100);

    this.update_exhaust(force);
  };

  this.update_exhaust = function (force) {
    const rnd = Vector.random(10);

    force.add(rnd);

    this.topExhaust.add_particle(force);
    this.bottomExhaust.add_particle(force);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.velocity.scale(Car.damp);
    this.position.add(this.velocity);
    this.acceleration.scale(0);
  };

  this.draw = function (context) {
    context.beginPath();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.orientation);
    context.drawImage(
      Car.image,
      0,
      0,
      Car.image.naturalWidth,
      Car.image.naturalHeight,
      (-1 * this.width) / 2,
      (-1 * this.height) / 2,
      this.width,
      this.height
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  };

  this.run = function (context) {
    const top = new Vector(-this.width / 2, -this.height / 3);
    const topPrime = new Vector(
      top.x * Math.cos(-1 * this.orientation) +
        top.y * Math.sin(-1 * this.orientation),
      top.y * Math.cos(-1 * this.orientation) -
        top.x * Math.sin(-1 * this.orientation)
    );
    const finalTop = Vector.add(this.position, topPrime);
    const bottom = new Vector(-this.width / 2, this.height / 3);
    const bottomPrime = new Vector(
      bottom.x * Math.cos(-1 * this.orientation) +
        bottom.y * Math.sin(-1 * this.orientation),
      bottom.y * Math.cos(-1 * this.orientation) -
        bottom.x * Math.sin(-1 * this.orientation)
    );
    const finalBottom = Vector.add(this.position, bottomPrime);

    if (this.isRunning) this.thrust();

    this.orientation += this.turnDirection;

    this.move();

    this.topExhaust.origin.copy(finalTop);
    this.bottomExhaust.origin.copy(finalBottom);

    this.topExhaust.run(context);
    this.bottomExhaust.run(context);

    this.draw(context);
  };

  this.activate_thrust = (event) => {
    if (event.key === "z" || event.key === "Z") this.isRunning = true;
  };

  this.deactivate_thrust = () => (this.isRunning = false);

  this.activate_rotation = (event) => {
    switch (event.key) {
      case "ArrowRight":
        this.turnDirection = Car.dA;
        break;
      case "ArrowLeft":
        this.turnDirection = -1 * Car.dA;
        break;
    }
  };

  this.deactivate_rotation = () => (this.turnDirection = 0);

  this.kms = () => {
    window.addEventListener("keydown", this.activate_thrust);
    window.addEventListener("keyup", this.deactivate_thrust);
    window.removeEventListener("keydown", this.activate_rotation);
    window.addEventListener("keyup", this.deactivate_rotation);
  };

  window.addEventListener("keydown", this.activate_thrust);
  window.addEventListener("keyup", this.deactivate_thrust);
  window.addEventListener("keydown", this.activate_rotation);
  window.addEventListener("keyup", this.deactivate_rotation);
}

Car.forceMag = 0.1;
Car.damp = 0.99;
Car.dA = 0.05;
Car.image = document.querySelector("#car-asset");

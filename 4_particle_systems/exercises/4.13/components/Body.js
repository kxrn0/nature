function Body(position, width, height, mass) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.width = width;
  this.height = height;
  this.mass = mass;
}

Body.prototype.apply_force = function (force) {
  force = force.clone().scale(1 / this.mass);

  this.acceleration.add(force);
};

Body.prototype.move = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.scale(0);
};

Body.prototype.draw = function (context) {
  context.beginPath();
  context.drawImage(
    Body.sprite,
    this.position.x - this.width / 2,
    this.position.y - this.height / 2,
    this.width,
    this.height
  );
};

Body.prototype.run = function (context) {
  this.move();
  this.draw(context);
};

Body.sprite = document.querySelector("#body-sprite");

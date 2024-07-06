function Square(position, width, height, color) {
  const mass = width * height;

  Body.call(this, position, mass);

  this.width = width;
  this.height = height;
  this.color = color;
  this.angle = 0;
  this.angularVelocity = 0;
  this.angularAcceleration = 0;
}

Object.setPrototypeOf(Square.prototype, Body.prototype);

Square.prototype.apply_force = function (force) {
  Body.prototype.apply_force.call(this, force);

  this.angularAcceleration += force.x / 50;
};

Square.prototype.move = function () {
  Body.prototype.move.call(this);

  this.angularVelocity += this.angularAcceleration;
  this.angle += this.angularVelocity;
  this.angularAcceleration = 0;
};

Square.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.translate(this.position.x, this.position.y);
  context.rotate(this.angle);
  context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  context.setTransform(1, 0, 0, 1, 0, 0);
};

Square.prototype.run = function (context, force) {
  this.apply_force(force);
  this.move();
  this.draw(context);
};

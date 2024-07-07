function Circle(position, radius, color) {
  const mass = Math.PI * radius * radius;

  Body.call(this, position, mass);

  this.radius = radius;
  this.color = color;
}

Object.setPrototypeOf(Circle.prototype, Body.prototype);

Circle.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();
};

Circle.prototype.run = function (context, force) {
  this.apply_force(force);
  this.move();
  this.draw(context);
};

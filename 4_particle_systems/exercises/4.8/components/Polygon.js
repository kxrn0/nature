function Polygon(vertices, color) {
  const position = find_centroid(vertices, -1);
  const mass = find_area(vertices, 1);

  Body.call(this, position, mass);

  this.vertices = vertices;
  this.color = color;
  this.angle = 0;
  this.angularVelocity = 0;
  this.angularAcceleration = 0;
}

Object.setPrototypeOf(Polygon.prototype, Body.prototype);

Polygon.prototype.apply_force = function (force) {
  Body.prototype.apply_force.call(this, force);

  this.angularAcceleration += force.x / 50;
};

Polygon.prototype.move = function () {
  const prevPosition = this.position.clone();
  const prevAngle = this.angle;

  Body.prototype.move.call(this);

  const diffPosition = Vector.sub(this.position, prevPosition);
  const diffAngle = this.angle - prevAngle;

  for (let vertex of this.vertices) {
    vertex.add(diffPosition);

    const dx = vertex.x - this.position.x;
    const dy = vertex.y - this.position.y;
    const newX =
      dx * Math.cos(diffAngle) - dy * Math.sin(diffAngle) + this.position.x;
    const newY =
      dx * Math.sin(diffAngle) + dy * Math.cos(diffAngle) + this.position.y;

    vertex.set(newX, newY);
  }
};

Polygon.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = this.color;
  context.moveTo(this.vertices[0].x, this.vertices[0].y);
  for (let i = 1; i < this.vertices.length; i++)
    context.lineTo(this.vertices[i].x, this.vertices[i].y);
  context.fill();
};

Polygon.prototype.run = function (context, force) {
  this.apply_force(force);
  this.move();
  this.draw(context);
};

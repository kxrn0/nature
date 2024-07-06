function Shard(vertices, color) {
  const centroid = find_centroid(vertices, -1);
  const position = Vector.from(centroid);
  const angle = 0;
  const mass = find_area(vertices, -1);

  Body.call(this, position, angle, mass);

  this.vertices = vertices.map((vertex) => Vector.from(vertex));
  this.color = color;
}

Object.setPrototypeOf(Shard.prototype, Body.prototype);

Shard.prototype.move = function () {
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

Shard.prototype.draw = function (context) {
  fill_polygon(context, this.vertices, this.color);
  stroke_polygon(context, this.vertices, "black");
};

Shard.prototype.run = function (context, force) {
  this.apply_force(force);
  this.move();
  this.draw(context);
};

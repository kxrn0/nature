export default function Mover(canvas, position, velocity, radius, color) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.velocity = velocity;
  this.radius = radius;
  this.color = color;
  this.boundaries = {
    x: { min: radius, max: canvas.width - radius },
    y: { min: radius, max: canvas.height - radius },
  };

  this.push = function (by, dt) {
    this.velocity.add(by.scale(dt));
  };

  this.move = function (dt) {
    const x = this.position.x + this.velocity.x * dt;
    const y = this.position.y + this.velocity.y * dt;

    if (this.boundaries.x.min < x && x < this.boundaries.x.max)
      this.position.x = x;
    else {
      if (x < this.boundaries.x.min) this.position.x = this.boundaries.x.min;
      else this.position.x = this.boundaries.x.max;

      this.velocity.x *= -1;
    }

    if (this.boundaries.y.min < y && y < this.boundaries.y.max)
      this.position.y = y;
    else {
      if (y < this.boundaries.y.min) this.position.y = this.boundaries.y.min;
      else this.position.y = this.boundaries.y.max;

      this.velocity.y *= -1;
    }
  };

  this.draw = function () {
    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();
  };

  this.update = function (dt) {
    this.move(dt);
    this.draw();
  };
}

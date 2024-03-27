export default function Bullet(position, velocity, canvas, destroy) {
  this.position = position;
  this.velocity = velocity;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.radius = 5;
  this.boundaries = {
    x: { min: this.radius, max: canvas.width - this.radius },
    y: { min: this.radius, max: canvas.height - this.radius },
  };
  this.destroy = destroy;

  this.draw = function () {
    this.context.beginPath();
    this.context.fillStyle = "pink";
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();
  };

  this.move = function () {
    this.position.add(this.velocity);

    if (
      this.position.x < this.boundaries.x.min ||
      this.boundaries.x.max < this.position.x ||
      this.position.y < this.boundaries.y.min ||
      this.boundaries.y.max < this.position.y
    )
      this.destroy(this);
  };

  this.update = function () {
    this.move();
    this.draw();
  };
}

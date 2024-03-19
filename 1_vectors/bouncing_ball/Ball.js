import random from "./random";

export default function Ball(canvas) {
  const red = ~~random(0, 255);
  const green = ~~random(0, 255);
  const blue = ~~random(0, 255);

  this.color = `rgb(${red}, ${green}, ${blue})`;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.radius = random(10, 20);
  this.position = {
    x: random(this.radius, canvas.width - this.radius),
    y: random(this.radius, canvas.height - this.radius),
  };
  this.velocity = { x: random(-5, 5), y: random(-5, 5) };

  this.move = function (dt) {
    const x = this.position.x + this.velocity.x;
    const y = this.position.y + this.velocity.y;

    if (this.radius < x && x < this.canvas.width - this.radius)
      this.position.x = x;
    else {
      this.velocity.x *= -1;
    }

    if (this.radius < y && y < this.canvas.height - this.radius)
      this.position.y = y;
    else this.velocity.y *= -1;
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

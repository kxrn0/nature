import random from "./random";

export default function Walker(canvas, position, radius) {
  const red = random(0, 255);
  const green = random(0, 255);
  const blue = random(0, 255);

  this.fillStyle = `rgb(${red}, ${green}, ${blue}, .5)`;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.radius = radius;
  this.boundaries = {
    x: { min: radius, max: canvas.width - radius },
    y: { min: radius, max: canvas.height - radius },
  };

  this.move = function (by) {
    this.position.add_safe(by, this.boundaries);
  };

  this.draw = function () {
    this.context.fillStyle = this.fillStyle;
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();
  };

  this.update = function (by) {
    this.move(by);
    this.draw();
  };
}

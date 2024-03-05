import random from "../utilities/random";

export default function Walker(canvas) {
  const red = random(0, 255);
  const green = random(0, 255);
  const blue = random(0, 255);

  this.fillStyle = `rgb(${red}, ${green}, ${blue})`;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = { x: random(0, canvas.width), y: random(0, canvas.height) };

  this.walk = (dt, fun) => {
    const x = dt * fun() + this.position.x;
    const y = dt * fun() + this.position.y;

    if (0 < x && x < this.canvas.width) this.position.x = x;
    if (0 < y && y < this.canvas.height) this.position.y = y;
  };

  this.draw = () => {
    this.context.fillStyle = this.fillStyle;
    this.context.beginPath();
    this.context.arc(this.position.x, this.position.y, 1, 0, Math.PI * 2);
    this.context.fill();
  };

  this.update = (dt, fun) => {
    this.walk(dt, fun);
    this.draw();
  };
}

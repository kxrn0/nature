import { createNoise2D } from "simplex-noise";
import random from "./utilities/random";

export default function Walker(canvas, position) {
  const red = random(0, 255);
  const green = random(0, 255);
  const blue = random(0, 255);

  this.fillStyle = `rgb(${red}, ${green}, ${blue})`;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.position = position;
  this.noise2D = createNoise2D();

  this.move = function (dt) {
    const nx = (this.noise2D(this.position.x, 0) * dt);
    const ny = (this.noise2D(0, this.position.y) * dt);
    const x = nx + this.position.x;
    const y = ny + this.position.y;

    if (0 < x && x < this.canvas.width) this.position.x = x;
    if (0 < y && y < this.canvas.height) this.position.y = y;
  };

  this.draw = function () {
    this.context.fillStyle = this.fillStyle;
    this.context.beginPath();
    this.context.arc(this.position.x, this.position.y, 1, 0, Math.PI * 2);
    this.context.fill();
  };

  this.update = function (dt) {
    this.move(dt);
    this.draw();
  };
}

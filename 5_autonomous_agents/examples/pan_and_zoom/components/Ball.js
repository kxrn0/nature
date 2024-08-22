import world_to_screen from "../utils/world_to_screen.js";
import Vector from "./Vector.js";

export default function Ball(position, radius, color) {
  this.position = position;
  this.radius = radius;
  this.color = color;
}

Ball.prototype.draw = function (context, offset, scale) {
  const radius = Math.max(scale.x * this.radius, 1);
  const screenCenter = new Vector(0, 0);

  world_to_screen(offset, scale, this.position, screenCenter);

  context.beginPath();
  context.fillStyle = this.color;
  context.arc(screenCenter.x, screenCenter.y, radius, 0, Math.PI * 2);
  context.fill();
};

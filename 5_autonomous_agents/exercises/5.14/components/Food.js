import map from "../utils/map.js";

export default function Food(position, de, maxE) {
  this.position = position;
  this.de = de;
  this.energy = de;
  this.maxE = maxE;
  this.radius = 0;
}

Food.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = "green";
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();
};

Food.prototype.run = function (context) {
  this.radius = map(this.energy, 0, this.maxE, 0, Food.R);
  this.energy = Math.min(this.energy + this.de, this.maxE);
  this.draw(context);
};

Food.R = 10;

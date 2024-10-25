export default function Ball(position, radius, cell) {
  this.position = position;
  this.radius = radius;
  this.cell = cell;
}

Ball.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = "white";
  context.storkeStyle = "black";
  context.lineWidth = 1;
  context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();
    
  context.fillStyle = "black";
  context.textAlign = "center";
  context.fillText(this.cell, this.position.x, this.position.y);
};

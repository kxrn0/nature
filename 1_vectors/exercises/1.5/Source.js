export default function Source(position, radius, amount, canvas) {
  this.position = position;
  this.radius = radius;
  this.amount = amount;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");

  this.draw = function (color) {
    this.context.beginPath();
    this.context.fillStyle = color;
    this.strokeStyle = "purple";
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.fillStyle = "azure";
    this.context.font = "20px monospace";
    this.context.fillText(~~this.amount, this.position.x, this.position.y);
  };
}

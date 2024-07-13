function Mud(u, corner, width, height) {
  this.u = u;
  this.corner = corner.clone();
  this.width = width;
  this.height = height;
}

Mud.prototype.draw = function (context) {
  context.fillStyle = "rgb(63, 36, 20, .5)";
  context.fillRect(this.corner.x, this.corner.y, this.width, this.height);
};

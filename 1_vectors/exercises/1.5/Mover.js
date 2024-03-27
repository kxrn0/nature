export default function Mover(position, velocity, drag) {
  this.position = position;
  this.velocity = velocity;
  this.drag = drag;

  this.react = function (to) {
    this.velocity.add(to);
  };

  this.move = function () {
    this.position.add(velocity);
    this.velocity.scale(this.drag);
  };
}

export default function Enemy(position, velocity, width, height) {
  this.position = position;
  this.velocity = velocity;

  this.draw = function (context) {
    context.beginPath();
  };
}

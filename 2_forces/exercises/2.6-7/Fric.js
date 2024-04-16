export default function Fric(context, position, radius) {
  this.context = context;
  this.position = position;
  this.radius = radius;

  this.fric = function (mover, dt) {
    const mag = -mover.mu;
    const friction = mover.velocity.copy().normalize().scale(mag);

    mover.apply_force(friction, dt);
  };

  this.draw = function () {
    this.context.beginPath();
    this.context.fillStyle = "#11112255";
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
  };
}

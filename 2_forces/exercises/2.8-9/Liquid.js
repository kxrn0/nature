import are_rects_colliding from "./are_rects_colliding";

export default function Liquid(context, corner, width, height) {
  this.context = context;
  this.corner = corner;
  this.width = width;
  this.height = height;

  this.draw = function () {
    this.context.beginPath();
    this.context.fillStyle = "#00112255";
    this.context.fillRect(
      this.corner.x,
      this.corner.y,
      this.width,
      this.height
    );
  };

  this.drag = function (mover) {
    const x = mover.position.x - mover.size / 2;
    const y = mover.position.y - mover.size / 2;
    const rect = { corner: { x, y }, width: mover.width, height: mover.height };

    if (!are_rects_colliding(this, rect)) return;

    const length =
      -Math.pow(mover.velocity.get_length(), 2) * mover.cd * mover.size;
    const force = mover.velocity.copy().set_length(length);

    mover.apply_force(force);
  };
}

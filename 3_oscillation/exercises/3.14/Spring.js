import Vector from "./Vector";

export default function Spring(anchor, restLength, k, color, width) {
  this.anchor = anchor;
  this.restLength = restLength;
  this.k = k;
  this.color = color;
  this.width = width;

  this.draw = function (context, end) {
    context.beginPath();
    context.fillStyle = this.color;
    context.strokeStyle = this.color;
    context.lineWidth = this.width;
    context.arc(this.anchor.x, this.anchor.y, 5, 0, Math.PI * 2);
    context.moveTo(this.anchor.x, this.anchor.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    context.fill();
  };

  this.connect = function (bob) {
    const force = Vector.add(bob.position, this.anchor.clone().scale(-1));
    const size = force.size();
    const stretch = size - this.restLength;

    force.set_size(-1 * this.k * stretch);
    bob.apply_force(force);
  };
}

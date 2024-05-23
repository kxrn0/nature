import Vector from "./Vector";

export default function Oscillator(
  anchor,
  angle,
  angularVelocity,
  angularAcceleration,
  amplitude
) {
  this.anchor = anchor.clone();
  this.angle = angle.clone();
  this.angularVelocity = angularVelocity.clone();
  this.angularAcceleration = angularAcceleration.clone();
  this.amplitude = amplitude;

  this.move = function () {
    this.angularVelocity.add(this.angularAcceleration);
    this.angle.add(this.angularVelocity);
    this.angularAcceleration.scale(0);
  };

  this.draw = function (context) {
    const offset = new Vector(
      Math.cos(this.angle.x),
      Math.sin(this.angle.y)
    ).scale(this.amplitude);
    const position = Vector.add(this.anchor, offset)

    context.beginPath();
    context.moveTo(this.anchor.x, this.anchor.y);
    context.lineTo(position.x, position.y);
    context.arc(position.x, position.y, 10, 0, Math.PI * 2);
    context.stroke();
  };
}

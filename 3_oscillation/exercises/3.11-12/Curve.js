import Vector from "./Vector";

export default function Curve(start, end, amplitude, da, dx) {
  this.start = start.clone();
  this.end = end.clone();
  this.amplitude = amplitude;
  this.da = da;
  this.dx = dx;
  this.startAngle = 0;

  this.draw = function (context) {
    context.beginPath();
    context.fillStyle = "gray";
    context.arc(this.start.x, this.start.y, 5, 0, Math.PI * 2);
    context.arc(this.end.x, this.end.y, 5, 0, Math.PI * 2);
    context.fill();

    const direction = new Vector(
      this.end.x - this.start.x,
      this.end.y - this.start.y
    );
    const size = direction.size();
    const steps = size / this.dx;
    const taperLength = steps * 0.1;
    let angle = this.startAngle;

    context.beginPath();
    context.translate(this.start.x, this.start.y);
    context.rotate(direction.angle());
    context.moveTo(0, 0);

    for (let x = 1; x <= steps; x++) {
      let amp;

      amp = this.amplitude;

      if (x <= taperLength) amp *= x / taperLength;
      else if (x >= steps - taperLength) amp *= (steps - x) / taperLength;

      const y = amp * (Math.sin(angle) + Math.cos(angle * 2));

      context.lineTo(x * this.dx, y);

      angle += this.da;
    }

    context.stroke();
    context.setTransform(1, 0, 0, 1, 0, 0);

    this.startAngle += this.da;
  };
}

import Bullet from "./Bullet";
import Vector from "./Vector";
import clamp from "./clamp";

export default function Player(
  position,
  velocity,
  drag,
  acc,
  canvas,
  radius,
  energy,
  maxEnergy,
  dE,
  add_bullet,
  destroy_bullet,
  paused
) {
  this.position = position;
  this.velocity = velocity;
  this.drag = drag;
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.radius = radius;
  this.energy = energy;
  this.maxEnergy = maxEnergy;
  this.dE = dE;
  this.add_bullet = add_bullet;
  this.destroy_bullet = destroy_bullet;
  this.boundaries = {
    x: { min: radius, max: canvas.width - radius },
    y: { min: radius, max: canvas.height - radius },
  };
  this.directions = {
    ArrowUp: new Vector(0, -acc),
    ArrowRight: new Vector(acc, 0),
    ArrowDown: new Vector(0, acc),
    ArrowLeft: new Vector(-acc, 0),
  };
  this.direction = null;
  this.sxarp = 0;
  this.heading = 0;
  this.paused = paused;

  this.add_energy = function (amount) {
    this.energy = clamp(this.energy + amount, 0, this.maxEnergy);
  };

  this.draw = function () {
    const angle = this.velocity.get_angle();
    const barLength = 200;
    const barHeight = 30;
    const p = this.energy / this.maxEnergy;
    const hBarLength = p * barLength;
    const barX = 50;
    const barY = 50;
    this.context.beginPath();
    this.context.fillStyle = "orange";
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fill();

    this.context.beginPath();
    this.context.fillStyle = "yellow";
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(angle);
    this.context.moveTo(this.radius, 0);
    this.context.lineTo(-this.radius, -this.radius);
    this.context.lineTo(-this.radius, this.radius);
    this.context.fill();
    this.context.setTransform(1, 0, 0, 1, 0, 0);

    this.context.beginPath();
    this.context.fillStyle = "#99cdfe99";
    this.context.fillRect(barY, barX, barLength, barHeight);
    this.context.fillStyle = "#99118899";
    this.context.fillRect(barX, barY, hBarLength, barHeight);
  };

  this.move = function () {
    const x = this.position.x + this.velocity.x;
    const y = this.position.y + this.velocity.y;

    if (this.boundaries.x.min < x && x < this.boundaries.x.max) {
      this.position.x = x;

      this.velocity.x *= this.drag;
    } else {
      if (x < this.boundaries.x.min) this.position.x = this.boundaries.x.min;
      else this.position.x = this.boundaries.x.max;

      this.velocity.x *= -this.drag;

      this.heading = this.velocity.get_angle();
    }

    if (this.boundaries.y.min < y && y < this.boundaries.y.max) {
      this.position.y = y;

      this.velocity.y *= this.drag;
    } else {
      if (y < this.boundaries.y.min) this.position.y = this.boundaries.y.min;
      else this.position.y = this.boundaries.y.max;

      this.velocity.y *= -this.drag;

      this.heading = this.velocity.get_angle();
    }
  };

  this.update = function () {
    if (this.direction) {
      this.velocity.add(this.direction);
      this.heading = this.velocity.get_angle();

      this.energy -= this.dE * 1.5;
    } else this.energy -= this.dE;

    this.move();
    this.draw();
  };

  this.handle_key_down = (event) => {
    if (this.paused) return;

    const v = this.directions[event.key];

    if (v === this.direction) return;

    if (v) {
      this.direction = v;
      this.sxarp++;
    }
  };

  this.handle_key_up = (event) => {
    if (this.paused) return;

    const v = this.directions[event.key];

    if (v) this.sxarp--;

    if (!this.sxarp) this.direction = null;
  };

  this.handle_shooting = (event) => {
    if (this.paused) return;

    const key = event.key.toUpperCase();

    if (key === "S") {
      const position = this.position.copy();
      const velocity = Vector.normal_from_angle(this.heading);
      const canvas = this.canvas;
      const destroy = this.destroy_bullet;

      velocity.scale(20);

      const bullet = new Bullet(position, velocity, canvas, destroy);

      this.add_bullet(bullet);
      this.energy -= 2 * this.dE;
    }
  };

  this.kill = () => {
    window.removeEventListener("keydown", this.handle_key_down);

    window.removeEventListener("keyup", this.handle_key_up);

    window.removeEventListener("keydown", this.handle_shooting);
  };

  window.addEventListener("keydown", this.handle_key_down);

  window.addEventListener("keyup", this.handle_key_up);

  window.addEventListener("keydown", this.handle_shooting);
}

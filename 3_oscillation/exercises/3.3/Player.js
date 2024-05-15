import Ball from "./Ball";
import Vector from "./Vector";
import base from "./assets/images/cannon_base.png";
import barrel from "./assets/images/cannon_body.png";

export default function Player(position, width = 100, height = 60) {
  this.position = position;

  const baseCorner = new Vector(
    position.x - width / 2,
    position.y - height / 2
  );
  const wScale = width / Player.baseImage.naturalWidth;
  const hScale = height / Player.baseImage.naturalHeight;
  const offX = wScale * 20;
  const offY = hScale * 40;
  const barrelCorner = new Vector(position.x - offX, position.y - offY);
  const barrelWidth = Player.barrelImage.naturalWidth * wScale;
  const barrelHeight = Player.barrelImage.naturalHeight * hScale;
  const angle = 0;

  this.baseBox = { corner: baseCorner, width, height, angle };
  this.barrelBox = {
    corner: barrelCorner,
    width: barrelWidth,
    height: barrelHeight,
    angle,
  };

  this.shoot = function (boundaries) {
    if (this.reloadFrames <= Player.reloadFrames) return;

    const position = new Vector(
      this.barrelBox.corner.x + this.barrelBox.width / 2,
      this.barrelBox.corner.y + this.barrelBox.height / 2
    );
    const velocity = new Vector(0, 0);
    const force = Vector.from_angle(this.barrelBox.angle, 300);
    const radius = 18;
    const mass = radius;
    const ball = new Ball(position, velocity, boundaries, radius, mass);

    ball.apply_force(force);

    this.reloadFrames = 0;

    return ball;
  };

  this.draw = function (context) {
    context.beginPath();
    context.drawImage(
      Player.baseImage,
      0,
      0,
      Player.baseImage.naturalWidth,
      Player.baseImage.naturalHeight,
      this.baseBox.corner.x,
      this.baseBox.corner.y,
      this.baseBox.width,
      this.baseBox.height
    );
    context.translate(
      this.barrelBox.corner.x + this.barrelBox.width / 2,
      this.barrelBox.corner.y + this.barrelBox.height / 2
    );
    context.rotate(this.barrelBox.angle);
    context.drawImage(
      Player.barrelImage,
      0,
      0,
      Player.barrelImage.naturalWidth,
      Player.barrelImage.naturalHeight,
      -this.barrelBox.width / 2,
      -this.barrelBox.height / 2,
      this.barrelBox.width,
      this.barrelBox.height
    );
    context.setTransform(1, 0, 0, 1, 0, 0);

    this.reloadFrames++;
  };

  this.rotate = function (by) {
    this.barrelBox.angle = Math.max(
      -Math.PI / 2 + 0.1,
      Math.min(0, this.barrelBox.angle + by)
    );
  };
}

Player.reloadFrames = 30;
Player.baseImage = document.createElement("img");
Player.barrelImage = document.createElement("img");
Player.baseImage.src = base;
Player.barrelImage.src = barrel;

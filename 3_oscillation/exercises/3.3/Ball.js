import ball from "./assets/images/cannon_ball.png";
import explossion from "./assets/images/explossion.png";
import boxes_intersect from "./boxes_intersect";
import Body from "./Body";
import Vector from "./Vector";

export default function Ball(position, velocity, boundaries, radius, mass) {
  Body.call(this, position, velocity, radius, mass, "red", "blue");

  const super_move = this.move;

  this.boundaries = boundaries;
  this.dying = false;
  this.deathFrames = 0;
  this.scale = radius / Ball.ballImg.naturalWidth;

  this.check_hit = function (them) {
    if (this.dying) return false;

    const corner = new Vector(
      this.position.x - radius / 2,
      this.position.y - radius / 2
    );

    const us = { corner, width: this.radius, height: this.radius };

    if (boxes_intersect(us, them)) return (this.dying = true);

    return false;
  };

  this.move = function () {
    if (this.dying) {
      this.deathFrames++;
    } else {
      super_move.call(this);

      const xOff = (Ball.expImg.naturalWidth * this.scale) / 2;
      const yOff = (Ball.expImg.naturalHeight * this.scale) / 2;

      if (this.position.x <= this.boundaries.x.min) {
        this.position.x = this.boundaries.x.min + xOff;
        this.dying = true;
      } else if (this.boundaries.x.max <= this.position.x) {
        this.position.x = this.boundaries.x.max - xOff;
        this.dying = true;
      }

      if (this.position.y <= this.boundaries.y.min) {
        this.position.y = this.boundaries.y.min + yOff;
        this.dying = true;
      } else if (this.boundaries.y.max <= this.position.y) {
        this.position.y = this.boundaries.y.max - yOff;
        this.dying = true;
      }
    }
  };

  this.is_dead = function () {
    return this.deathFrames >= Ball.maxFrames;
  };

  this.draw = function (context) {
    context.beginPath();

    if (this.dying) {
      const dW = Ball.expImg.naturalWidth * this.scale;
      const dH = Ball.expImg.naturalHeight * this.scale;
      const dx = this.position.x - dW / 2;
      const dy = this.position.y - dH / 2;

      context.drawImage(
        Ball.expImg,
        0,
        0,
        Ball.expImg.naturalWidth,
        Ball.expImg.naturalHeight,
        dx,
        dy,
        dW,
        dH
      );
    } else {
      context.translate(this.position.x, this.position.y);
      context.rotate(this.angle);
      context.drawImage(
        Ball.ballImg,
        0,
        0,
        Ball.ballImg.naturalWidth,
        Ball.ballImg.naturalHeight,
        -this.radius,
        -this.radius,
        this.radius * 2,
        this.radius * 2
      );
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
  };
}

Ball.maxFrames = 60;
Ball.ballImg = document.createElement("img");
Ball.expImg = document.createElement("img");
Ball.ballImg.src = ball;
Ball.expImg.src = explossion;

Object.setPrototypeOf(Ball.prototype, Body.prototype);

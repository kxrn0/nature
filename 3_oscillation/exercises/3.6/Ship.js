import car from "./car.png";
import Vector from "./Vector";

export default function Ship(position, boundaries, width, height) {
  this.position = position.clone();
  this.velocity = new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.boundaries = boundaries;
  this.width = width;
  this.height = height;
  this.angle = 0;

  this.thrust = function () {
    const force = Vector.from_angle(this.angle);

    this.acceleration.add(force);
  };

  this.turn_left = function () {
    this.angle -= Ship.dA;
  };

  this.turn_right = function () {
    this.angle += Ship.dA;
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.scale(Ship.drag);
    this.acceleration.scale(0);
  };

  this.check_edges = function () {
    if (this.position.x <= this.boundaries.x.min)
      this.position.x = this.boundaries.x.max - 1;
    else if (this.boundaries.x.max <= this.position.x)
      this.position.x = this.boundaries.x.min + 1;

    if (this.position.y <= this.boundaries.y.min)
      this.position.y = this.boundaries.y.max - 1;
    else if (this.boundaries.y.max <= this.position.y)
      this.position.y = this.boundaries.y.min + 1;
  };

  this.draw = function (context) {
    context.beginPath();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.drawImage(
      Ship.img,
      0,
      0,
      Ship.img.naturalWidth,
      Ship.img.naturalHeight,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  };
}

Ship.drag = 0.99;
Ship.dA = 0.05;
Ship.img = document.createElement("img");
Ship.img.src = car;

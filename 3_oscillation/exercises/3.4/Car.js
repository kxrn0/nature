import Body from "./Body";
import Vector from "./Vector";
import car from "./car.png";

export default function Car(position, width, height) {
  const velocity = new Vector(0, 0);

  Body.call(this, position, velocity, width, width + height);

  this.width = width;
  this.height = height;

  this.draw = function (context) {
    context.beginPath();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.angle);
    context.drawImage(
      Car.img,
      0,
      0,
      Car.img.naturalWidth,
      Car.img.naturalHeight,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
  };
}

Car.img = document.createElement("img");
Car.img.src = car;

Object.setPrototypeOf(Car.prototype, Body.prototype);

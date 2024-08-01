import ImageField from "./components/ImageField.js";
import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const img = document.querySelector("img");
const vehicles = [];
let field;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let vehicle of vehicles) {
    vehicle.follow(field);
    vehicle.run(context);
  }

  field.draw(context);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const res = 10;
  const center = new Vector(innerWidth / 2, innerHeight / 2);

  field = new ImageField(img, width, height, res, center);

  for (let i = 0; i < 1000; i++) {
    const position = center.clone().add(Vector.random(100));
    const size = 1;
    const maxSpeed = 5;
    const maxForce = 0.5;
    const color = "red";
    const isConstrained = true;
    const box = {
      x: { min: 0, max: innerWidth },
      y: { min: 0, max: innerHeight },
    };
    const vehicle = new Vehicle(
      position,
      size,
      size,
      size,
      maxSpeed,
      maxForce,
      color,
      isConstrained,
      box
    );

    vehicles.push(vehicle);
  }

  requestAnimationFrame(anime);
}

init();

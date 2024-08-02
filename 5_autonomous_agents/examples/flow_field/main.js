import PerlinField from "./components/PerlinField.js";
import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";
import is_point_in_box from "./utils/is_point_in_box.js";
import map from "./utils/map.js";
import random from "./utils/random.js";
import throw_particle_at_box from "./utils/throw_particle_at_box.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const maxSpeed = 1;
const vehicles = [];
let field;

function anime() {
  context.fillStyle = "rgb(0, 0, 0, .001)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let vehicle of vehicles) {
    vehicle.follow(field);

    const hue = map(
      vehicle.position.x - field.corner.x,
      0,
      field.width,
      0,
      360
    );
    const color = `hsla(${hue}, 100%, 50%, .01)`;

    vehicle.color = color;

    vehicle.run(context);

    if (!is_point_in_box(vehicle.position, field))
      throw_particle_at_box(vehicle, field, maxSpeed);
  }

  requestAnimationFrame(anime);
}

function init() {
  const center = new Vector(innerWidth / 2, innerHeight / 2);
  const width = innerWidth / 1.25;
  const height = innerHeight / 1.25;
  const res = 1;
  const dt = 0.005;

  field = new PerlinField(center, width, height, res, dt);

  for (let i = 0; i < 10000; i++) {
    const position = new Vector(innerWidth, random(0, innerHeight));
    const radius = 1;
    const maxForce = 1;
    const color = "hsla(0, 100%, 50%, .01)";
    const isConstrained = true;
    const box = {
      x: { min: 0, max: innerWidth },
      y: { min: 0, max: innerHeight },
    };
    const vehicle = new Vehicle(
      position,
      radius,
      maxSpeed,
      maxForce,
      color,
      isConstrained,
      box
    );

    vehicle.apply_force(new Vector(-5, 0));

    vehicles.push(vehicle);
  }

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(anime);
}

init();

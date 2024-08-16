import Vehicle from "./components/Vehicle.js";
import Vector from "./components/Vector.js";
import random from "./utils/random.js";
import Food from "./components/Food.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const food = [];
const box = { x: { min: 0, max: innerWidth }, y: { min: 0, max: innerHeight } };
let vehicles;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (random(0, 100) < 5) {
    const position = new Vector(
      random(0, canvas.width),
      random(0, canvas.height)
    );
    const de = 0.05;
    const maxE = 100;
    const plant = new Food(position, de, maxE);

    food.push(plant);
  }

  for (let plant of food) plant.run(context);

  for (let vehicle of vehicles) {
    const v = vehicle.run(context, vehicles, food, box);

    if (v) vehicles.push(v);
  }

  vehicles = vehicles.filter((v) => v.health >= 0);

  requestAnimationFrame(anime);
}

function init() {
  const debugToggle = document.querySelector("input");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  vehicles = [];

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.offsetX, event.offsetY);
    const width = 8;
    const height = 4;
    const mass = width + height;
    const color = "red";
    const maxSpeed = 0.5;
    const maxForce = 0.5;
    const maxHealth = 100;
    const dh = 0.1;
    const vehicle = new Vehicle(
      position,
      width,
      height,
      mass,
      color,
      maxSpeed,
      maxForce,
      maxHealth,
      dh,
      debugToggle.checked
    );

    vehicles.push(vehicle);
  });

  debugToggle.addEventListener("change", () =>
    vehicles.forEach((v) => (v.showDebug = debugToggle.checked))
  );

  requestAnimationFrame(anime);
}

init();

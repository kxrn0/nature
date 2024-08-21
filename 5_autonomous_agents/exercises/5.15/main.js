import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";
import random from "./utils/random.js";
import random_rgb from "./utils/random_rgb.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const debugToggle = document.querySelector("input");
const box = { x: null, y: null };
const vehicles = [];
let isDragging;

function add_vehicle(position) {
  const width = 8;
  const height = 4;
  const mass = width + height;
  const color = random_rgb();
  const maxSpeed = 10;
  const maxForce = 5;
  const visionDistance = 100;
  const visionSpan = Math.PI / 2;
  const showDebug = debugToggle.checked;
  const vehicle = new Vehicle(
    position,
    width,
    height,
    mass,
    color,
    maxSpeed,
    maxForce,
    visionDistance,
    visionSpan,
    showDebug
  );

  vehicles.push(vehicle);
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (const vehicle of vehicles) {
    vehicle.run(context, vehicles, box);
  }

  requestAnimationFrame(anime);
}

function init() {
  box.x = { min: 0, max: innerWidth };
  box.y = { min: 0, max: innerHeight };

  isDragging = false;

  for (let i = 0; i < 100; i++)
    add_vehicle(new Vector(random(0, innerWidth), random(0, innerHeight)));

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("mousedown", () => (isDragging = true));

  canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const position = new Vector(event.offsetX, event.offsetY);

    add_vehicle(position);
  });

  canvas.addEventListener("mouseup", () => (isDragging = false));

  debugToggle.addEventListener("change", () =>
    vehicles.forEach((v) => (v.showDebug = debugToggle.checked))
  );

  requestAnimationFrame(anime);
}

init();

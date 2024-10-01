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
  const visionDistance = 200;
  const visionSpan = Math.PI / 2;
  const visionClearRadius = 50;
  const visionClearAngle = Math.PI / 6;
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
    visionClearRadius,
    visionClearAngle,
    showDebug
  );

  vehicles.push(vehicle);
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let vehicle of vehicles) {
    vehicle.run(context, vehicles, box);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  box.x = { min: 0, max: innerWidth };
  box.y = { min: 0, max: innerHeight };

  isDragging = false;

  for (let i = 0; i < 100; i++) {
    const position = new Vector(random(0, innerWidth), random(0, innerHeight));

    add_vehicle(position);
  }

  canvas.addEventListener("mousedown", () => (isDragging = true));

  canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    add_vehicle(new Vector(event.offsetX, event.offsetY));
  });

  canvas.addEventListener("mouseup", () => (isDragging = false));

  canvas.addEventListener("click", (event) =>
    add_vehicle(new Vector(event.offsetX, event.offsetY))
  );

  debugToggle.addEventListener("change", () =>
    vehicles.forEach((v) => (v.showDebug = debugToggle.checked))
  );

  requestAnimationFrame(anime);
}

init();

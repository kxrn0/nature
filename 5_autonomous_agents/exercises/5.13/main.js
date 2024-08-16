import Path from "./components/Path.js";
import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";
import create_random_polygon from "./utils/create_random_polygon.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const vehicles = [];
let path, showDebug;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  path.draw(context);

  for (let vehicle of vehicles) {
    vehicle.separate(vehicles);
    vehicle.follow(path);
    vehicle.run(context);
  }

  requestAnimationFrame(anime);
}

function init() {
  const input = document.querySelector("input");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  showDebug = false;

  const center = new Vector(innerWidth / 2, innerHeight / 2);
  const minSides = 5;
  const maxSides = 10;
  const minRadius = 200;
  const maxRadius = 400;
  const vertices = create_random_polygon(
    center,
    minSides,
    maxSides,
    minRadius,
    maxRadius
  );
  const pathRadius = 25;

  vertices.push(vertices[0]);

  path = new Path(vertices, pathRadius);

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.offsetX, event.offsetY);
    const radius = 10;
    const mass = radius;
    const color = "skyblue";
    const maxSpeed = 5;
    const maxForce = 1;
    const vehicle = new Vehicle(
      position,
      radius,
      mass,
      color,
      maxSpeed,
      maxForce,
      showDebug
    );
    const push = Vector.random(10);

    vehicle.apply_force(push);

    vehicles.push(vehicle);
  });

  input.addEventListener("change", () => {
    showDebug = input.checked;

    vehicles.forEach((v) => (v.debugInfo.showDebug = showDebug));
  });

  requestAnimationFrame(anime);
}

init();

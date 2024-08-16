import Path from "./components/Path.js";
import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";
import update_points from "./utils/update_points.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const center = new Vector(innerWidth / 2, innerHeight / 2);
const vehicles = new Array(100);
const points = new Array(10);
const minRad = 200;
const maxRad = 400;
const dt = 0.01;
let path, t;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  path.draw(context);

  for (let vehicle of vehicles) {
    vehicle.follow(path);
    vehicle.run(context);
  }

  t += dt;
  update_points(points, center, minRad, maxRad, t);

  requestAnimationFrame(anime);
}

function init() {
  const pathRadius = 25;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  t = 0;

  update_points(points, center, minRad, maxRad, t);

  path = new Path(points, pathRadius);

  for (let i = 0; i < vehicles.length; i++) {
    const angle = (i * Math.PI * 2) / vehicles.length;
    const radius = minRad;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const position = new Vector(x, y).add(center);
    const width = 10;
    const height = 5;
    const mass = width * height;
    const maxSpeed = 10;
    const maxForce = 10;
    const color = "red";
    const vehicle = new Vehicle(
      position,
      width,
      height,
      mass,
      maxSpeed,
      maxForce,
      color
    );

    vehicles[i] = vehicle;
  }

  requestAnimationFrame(anime);
}

init();

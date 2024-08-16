import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const vehicles = [];
const pointer = new Vector(0, 0);
const box = {};

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let vehicle of vehicles) {
    vehicle.cohere(vehicles);
    vehicle.run(context);
    vehicle.check_edges(box);
  }

  context.beginPath();
  context.strokeStyle = "skyblue";
  context.arc(pointer.x, pointer.y, 30, 0, Math.PI * 2);
  context.stroke();

  context.beginPath();
  context.strokeStyle = "red";
  context.strokeRect(
    box.x.min,
    box.y.min,
    box.x.max - box.x.min,
    box.y.max - box.y.min
  );

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  box.x = { min: 200, max: innerWidth - 200 };
  box.y = { min: 200, max: innerHeight - 200 };

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.offsetX, event.offsetY);
    const radius = 15;
    const mass = radius;
    const color = "gray";
    const maxSpeed = 5;
    const maxForce = 1;
    const vehicle = new Vehicle(
      position,
      radius,
      mass,
      color,
      maxSpeed,
      maxForce
    );

    vehicles.push(vehicle);
  });

  canvas.addEventListener("mousemove", (event) =>
    pointer.set(event.offsetX, event.offsetY)
  );

  requestAnimationFrame(anime);
}

init();

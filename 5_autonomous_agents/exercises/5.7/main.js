const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const vehicles = [];
const interval = 1000;
const center = new Vector(innerWidth / 2, innerHeight / 2);
const box = { x: { min: 0, max: innerWidth }, y: { min: 0, max: innerHeight } };
const dz = 0.001;
const noise = createNoise3D();
let grid, prevTime, isDrawing, zOff;

function fun(vectors, resolution, cols, rows) {
  set_perlin(vectors, resolution, cols, rows, zOff, noise);
}

function anime(timestamp) {
  const dt = timestamp - prevTime;

  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (isDrawing) grid.draw(context);

  if (dt >= interval) {
    const vehicle = new Vehicle(center, 20, 10, 30, 10, 5, "red", true, box);

    vehicles.push(vehicle);

    prevTime = timestamp;
  }

  grid.apply_function(fun);

  for (let vehicle of vehicles) {
    vehicle.follow(grid);

    vehicle.run(context);
  }

  zOff += dz;

  requestAnimationFrame(anime);
}

function init() {
  const toggle = document.querySelector("input");

  toggle.addEventListener("change", () => (isDrawing = toggle.checked));

  grid = new Grid(20, innerWidth, innerHeight, fun);
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  prevTime = 0;
  isDrawing = true;
  zOff = 0;

  requestAnimationFrame(anime);
}

init();

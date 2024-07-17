const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const MODES = { WALL: "wall", VEHICLE: "vehicle" };
const wanderers = [];
const walls = [];
const start = new Vector(0, 0);
const end = new Vector(0, 0);
const boundaries = {
  x: { min: 0, max: innerWidth },
  y: { min: 0, max: innerHeight },
};
let mode, isDragging, showDebug;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (isDragging) {
    context.beginPath();
    context.strokeStyle = "orange";
    context.lineWidth = 5;
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  for (let wall of walls) wall.draw(context);

  for (let wanderer of wanderers) {
    for (let other of wanderers)
      if (wanderer !== other) wanderer.avoid_peer(other);

    for (let wall of walls) wanderer.avoid_wall(wall);

    wanderer.wander();
    wanderer.run(context);
    wanderer.stay_in_box(boundaries);
  }

  requestAnimationFrame(anime);
}

function init_controls() {
  const wallRadio = document.querySelector("#wall-radio");
  const vehicleRadio = document.querySelector("#vehicle-radio");
  const debugBox = document.querySelector("#debug-box");

  wallRadio.addEventListener("change", () => (mode = MODES.WALL));

  vehicleRadio.addEventListener("change", () => {
    mode = MODES.VEHICLE;
    isDragging = false;
  });

  debugBox.addEventListener("change", (event) => {
    showDebug = event.target.checked;
    wanderers.forEach((wanderer) => (wanderer.showDebug = showDebug));
  });

  canvas.addEventListener("mousedown", (event) => {
    if (mode === MODES.WALL) {
      isDragging = true;

      start.set(event.offsetX, event.offsetY);
      end.copy(start);
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (mode === MODES.WALL) end.set(event.offsetX, event.offsetY);
  });

  canvas.addEventListener("mouseup", (event) => {
    if (mode === MODES.WALL) {
      const size = Vector.from_segment(start, end).size();

      isDragging = false;

      if (size <= 10) return;

      const wall = new Wall(start, end);

      walls.push(wall);
    } else {
      const position = new Vector(event.offsetX, event.offsetY);
      const width = 20;
      const height = 10;
      const mass = width * height;
      const wanderRadius = height;
      const lookAhead = width + height;
      const maxSpeed = 5;
      const maxForce = 5;
      const color = random_rgb();
      const wanderer = new Wanderer(
        position,
        width,
        height,
        mass,
        wanderRadius,
        lookAhead,
        maxSpeed,
        maxForce,
        color,
        showDebug
      );

      wanderers.push(wanderer);
    }
  });
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  mode = MODES.WALL;
  isDragging = false;
  showDebug = true;

  init_controls();

  requestAnimationFrame(anime);
}

init();

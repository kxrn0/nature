const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const mouse = new Vector(innerWidth / 2, innerHeight / 2);
const prey = new Vehicle(
  new Vector(innerWidth / 2, innerHeight / 2),
  20,
  10,
  250,
  10,
  "green"
);
const MODES = { PREDATOR: "predator", MUD: "mud" };
const swamps = [];
const predators = [];
const mudBox = { corner: null, width: null, height: null };
let mode;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let swamp of swamps) swamp.draw(context);

  prey.check_deterrents(swamps);
  prey.run(context);

  for (let predator of predators) {
    predator.check_deterrents(swamps);
    predator.chase(prey);
    predator.run(context);

    prey.flee(predator);
  }

  if (mudBox.corner) draw_box(context, mudBox, "red");

  requestAnimationFrame(anime);
}

function init_controls() {
  const predatorRadio = document.querySelector("#predator");
  const mudRadio = document.querySelector("#mud");

  predatorRadio.addEventListener("change", () => (mode = MODES.PREDATOR));

  mudRadio.addEventListener("change", () => (mode = MODES.MUD));

  canvas.addEventListener("mousedown", (event) => {
    if (mode === MODES.PREDATOR) return;

    const corner = new Vector(event.offsetX, event.offsetY);

    mudBox.corner = corner;
    mudBox.width = 0;
    mudBox.height = 0;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (mode === MODES.PREDATOR || !mudBox.corner) return;

    mudBox.width = event.offsetX - mudBox.corner.x;
    mudBox.height = event.offsetY - mudBox.corner.y;
  });

  canvas.addEventListener("mouseup", (event) => {
    if (mode === MODES.PREDATOR) {
      const position = new Vector(event.offsetX, event.offsetY);
      const width = 15;
      const height = 25;
      const mass = width * height;
      const maxSpeed = 5;
      const color = "red";
      const predator = new Vehicle(
        position,
        width,
        height,
        mass,
        maxSpeed,
        color
      );

      predators.push(predator);
    } else {
      if (Math.abs(mudBox.width) < 10 || Math.abs(mudBox.height) < 10) return;

      if (mudBox.width < 0) {
        mudBox.corner.x += mudBox.width;
        mudBox.width *= -1;
      }
      if (mudBox.height < 0) {
        mudBox.corner.y += mudBox.height;
        mudBox.height *= -1;
      }

      const u = 0.01;
      const swamp = new Mud(u, mudBox.corner, mudBox.width, mudBox.height);

      swamps.push(swamp);
      mudBox.corner = null;
    }
  });
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init_controls();

  mode = MODES.PREDATOR;

  requestAnimationFrame(anime);
}

init();

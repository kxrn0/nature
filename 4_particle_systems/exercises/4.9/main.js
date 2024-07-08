const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const MODES = {
  ATTRACTOR: "attractor",
  REPELLER: "repeller",
  SYSTEM: "system",
};
const gravity = new Vector(0, 5);
const systems = [];
const disturbances = [];
let mode, strength;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let disturbance of disturbances) disturbance.draw(context);

  for (let system of systems) {
    for (let disturbance of disturbances) system.apply_disturbance(disturbance);

    system.apply_force(gravity);
    system.run(context);
  }

  requestAnimationFrame(anime);
}

function init_controls() {
  const attractControl = document.querySelector("input[value='attractor']");
  const repelControl = document.querySelector("input[value='repeller']");
  const systemControl = document.querySelector("input[value='system']");
  const strenghtControl = document.querySelector("input[type='range']");

  attractControl.addEventListener("change", () => (mode = MODES.ATTRACTOR));

  repelControl.addEventListener("change", () => (mode = MODES.REPELLER));

  systemControl.addEventListener("change", () => (mode = MODES.SYSTEM));

  strenghtControl.addEventListener(
    "change",
    () => (strength = Number(strenghtControl.value))
  );

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.offsetX, event.offsetY);
    const radius = 5;
    let direction, color;

    direction = 1;
    color = "red";

    switch (mode) {
      case MODES.REPELLER:
        direction = -1;
        color = "blue";
      case MODES.ATTRACTOR:
        const disturbance = new Disturbance(
          position,
          strength,
          direction,
          color,
          radius
        );

        disturbances.push(disturbance);
        break;
      case MODES.SYSTEM:
        const minLifeSpan = 250;
        const maxLifeSpan = 300;
        const minDecay = 1;
        const maxDecay = 1.5;
        const push = 100;
        const system = new ParticleSystem(
          position,
          minLifeSpan,
          maxLifeSpan,
          minDecay,
          maxDecay,
          push
        );

        systems.push(system);
        break;
    }
  });
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  mode = MODES.SYSTEM;
  strength = 5000;

  init_controls();

  requestAnimationFrame(anime);
}

init();

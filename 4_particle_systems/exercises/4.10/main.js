const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = new Vector(0, 5);
const systems = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let system of systems) {
    for (let other of systems)
      if (other !== system) system.interact_with_other(other.particles);

    system.run(context);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.offsetX, event.offsetY);
    const minLifeSpan = 250;
    const maxLifeSpan = 300;
    const minDecay = 1;
    const maxDecay = 1.5;
    const push = 10;
    const system = new ParticleSystem(
      position,
      minLifeSpan,
      maxLifeSpan,
      minDecay,
      maxDecay,
      push
    );

    systems.push(system);
  });

  requestAnimationFrame(anime);
}

init();

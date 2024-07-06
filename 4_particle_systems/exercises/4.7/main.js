const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = new Vector(0, 10);
const systems = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let system of systems) {
    const position = system.origin;
    const color = random_rgb();
    let body;

    if (random(1, 10) < 5) {
      const radius = random(5, 10);

      body = new Circle(position, radius, color);
    } else {
      const width = random(5, 15);
      const height = random(5, 15);

      body = new Square(position, width, height, color);
    }

    system.add_particles([body]);

    system.run(context, gravity);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const origin = new Vector(event.offsetX, event.offsetY);
    const minLifeSpan = 1000;
    const maxLifeSpan = 1500;
    const minDecay = 1;
    const maxDecay = 5;
    const strength = 500;
    const system = new ParticleSystem(
      origin,
      minLifeSpan,
      maxLifeSpan,
      minDecay,
      maxDecay,
      strength
    );

    systems.push(system);
  });

  requestAnimationFrame(anime);
}

init();

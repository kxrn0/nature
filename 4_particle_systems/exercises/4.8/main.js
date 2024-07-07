const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = new Vector(0, 5);
const systems = [];

function circle_factory(position) {
  const radius = random(5, 10);
  const color = random_rgb();

  return new Circle(position, radius, color);
}

function square_factory(position) {
  const width = random(5, 15);
  const height = random(5, 15);
  const color = random_rgb();

  return new Square(position, width, height, color);
}

function polygon_factory(position) {
  const minSides = 5;
  const maxSides = 10;
  const minRadius = 10;
  const maxRadius = 20;
  const vertices = create_random_polygon(
    position,
    minSides,
    maxSides,
    minRadius,
    maxRadius
  );
  const color = random_rgb();

  return new Polygon(vertices, color);
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let system of systems) system.run(context, gravity);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const origin = new Vector(event.offsetX, event.offsetY);
    const factories = [circle_factory, square_factory, polygon_factory];
    const minLifeSpan = 100;
    const maxLifeSpan = 200;
    const minDecay = 0.5;
    const maxDecay = 1;
    const strength = 1000;
    const system = new ParticleSystem(
      origin,
      factories,
      minLifeSpan,
      maxLifeSpan,
      minDecay,
      maxDecay,
      strength
    );

    system.turn_on();

    systems.push(system);
  });

  requestAnimationFrame(anime);
}

init();

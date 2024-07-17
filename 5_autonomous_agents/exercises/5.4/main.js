const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const wanderers = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < wanderers.length - 1; i++) {
    const radius = 25;

    for (let j = i + 1; j < wanderers.length; j++) {
      const a = wanderers[i];
      const b = wanderers[j];

      if (a !== b) {
        const ball1 = { center: a.position, radius };
        const ball2 = { center: b.position, radius };

        if (balls_touch(ball1, ball2)) {
          a.flee(b.position);
          b.flee(a.position);
        }
      }
    }
  }

  for (let wander of wanderers) wander.run(context);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const position = new Vector(event.offsetX, event.offsetY);
    const width = 10;
    const height = 5;
    const wanderRadius = 5;
    const lookAhead = 15;
    const maxSpeed = 2;
    const maxForce = 0.05;
    const color = random_rgb();
    const wanderer = new Wanderer(
      position,
      width,
      height,
      wanderRadius,
      lookAhead,
      maxSpeed,
      maxForce,
      color
    );

    wanderers.push(wanderer);
  });

  requestAnimationFrame(anime);
}

init();

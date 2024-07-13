const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const fan = new Disturbance(
  new Vector(innerWidth / 2, innerHeight / 2),
  5000,
  -1,
  "skyblue",
  25
);
const fires = [];
let isMoving = false;

function anime() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  fan.draw(context);

  for (let fire of fires) {
    fire.add_particles(5);
    fire.apply_disturbance(fan);
    fire.burn(context);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("mousedown", (event) => {
    const point = new Vector(event.offsetX, event.offsetY);

    if (is_point_in_circle(fan, point)) {
      isMoving = true;
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (isMoving) fan.position.set(event.offsetX, event.offsetY);
  });

  canvas.addEventListener("mouseup", (event) => {
    if (isMoving) return (isMoving = false);

    const origin = new Vector(event.offsetX, event.offsetY);
    const fire = new Fire(origin);

    fires.push(fire);
  });

  requestAnimationFrame(anime);
}

init();

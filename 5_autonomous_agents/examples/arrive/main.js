const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let behicle, target, isMobing;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_circle(context, target, "red");

  behicle.arrive(target);
  behicle.run(context);

  requestAnimationFrame(anime);
}

function init() {
  const center = new Vector(innerWidth / 2, innerHeight / 2);
  const width = 30;
  const height = 20;
  const mass = (width + height) / 10;
  const maxSpeed = 10;
  const color = "blue";

  canvas.addEventListener("mousedown", (event) => {
    const point = new Vector(event.offsetX, event.offsetY);

    if (is_point_in_circle(target, point)) isMobing = true;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (isMobing) target.position.set(event.offsetX, event.offsetY);
  });

  canvas.addEventListener("mouseup", () => (isMobing = false));

  behicle = new Vehicle(center, width, height, mass, maxSpeed, color);
  target = {
    position: new Vector((2 * innerWidth) / 3, (2 * innerHeight) / 3),
    radius: 15,
  };

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  requestAnimationFrame(anime);
}

init();

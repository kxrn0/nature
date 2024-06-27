const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = new Vector(0, 1);
const manager = new FireworkManager(
  new Vector(innerWidth / 2, (8 * innerHeight) / 9),
  -Math.PI / 4
);

function draw_ground() {
  context.fillStyle = "firebrick";
  context.fillRect(0, (8 * innerHeight) / 9, innerWidth, innerHeight / 5);
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgb(100, 100, 100)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  manager.run(context, gravity);

  draw_ground();

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  requestAnimationFrame(anime);
}

init();

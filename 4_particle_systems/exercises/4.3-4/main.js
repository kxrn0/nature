const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const car = new Car(new Vector(innerWidth / 2, innerHeight / 2), 0, 200, 50);

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  car.run(context);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  requestAnimationFrame(anime);
}

init();

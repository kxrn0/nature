import Car from "./Car";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let car;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!(Date.now() % 1000)) console.log(car);

  car.move();
  car.draw(context);

  requestAnimationFrame(anime);
}

function init() {
  const mag = 100;
  const up = new Vector(0, -mag);
  const right = new Vector(mag, 0);
  const down = new Vector(0, mag);
  const left = new Vector(-mag, 0);
  const position = new Vector(innerWidth / 2, innerHeight / 2);

  car = new Car(position, 100, 100);

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        car.apply_force(up);
        break;
      case "ArrowRight":
        car.apply_force(right);
        break;
      case "ArrowDown":
        car.apply_force(down);
        break;
      case "ArrowLeft":
        car.apply_force(left);
    }
  });

  requestAnimationFrame(anime);
}

init();

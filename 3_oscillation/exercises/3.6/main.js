import Ship from "./Ship";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const center = new Vector(innerWidth / 2, innerHeight / 2);
const boundaries = {
  x: { min: -100, max: innerWidth + 100 },
  y: { min: -100, max: innerHeight + 100 },
};
const ship = new Ship(center, boundaries, 100, 100);

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  ship.move();
  ship.check_edges();
  ship.draw(context);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        ship.turn_left();
        break;
      case "ArrowRight":
        ship.turn_right();
        break;
      case "Z":
      case "z":
        ship.thrust();
    }
  });

  requestAnimationFrame(anime);
}

init();

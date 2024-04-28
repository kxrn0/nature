import Attractor from "./Attractor";
import Mover from "./Mover";
import Vector from "./Vector";
import create_polygon from "./create_polygon";
import rotate_point from "./rotate_point";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const dt = 1;
let tractors, movers, center, t;

function anime() {
  context.fillStyle = "#0000000f";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let tractor of tractors) {
    for (let mover of movers) tractor.attract(mover);

    tractor.position.rotate_by(0.01, center);
    tractor.draw();
  }

  for (let mover of movers) {
    mover.move();
    mover.draw(`hsl(${t}, 100%, 50%)`);
  }

  t += dt;

  requestAnimationFrame(anime);
}

function init() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  center = new Vector(width / 2, height / 2);
  canvas.width = width;
  canvas.height = height;
  t = 0;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  tractors = create_polygon(3, 200, center).map(
    (point) => new Attractor(context, Vector.from(point), 1, "white")
  );

  movers = create_polygon(1000, 100, center).map(
    (point) => new Mover(canvas, Vector.from(point), new Vector(0, 0), 1, "red")
  );

  console.log(tractors);

  requestAnimationFrame(anime);
}

init();

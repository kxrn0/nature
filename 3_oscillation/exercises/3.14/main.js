import Body from "./Body";
import Spring from "./Spring";
import System from "./System";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const systems = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  systems.forEach((s) => {
    s.move();
    s.draw(context);
  });

  requestAnimationFrame(anime);
}

function init() {
  const v = new Vector(0, 0);
  const r = 30;
  const mass = r;
  const d = 0.99;
  const color = "red";

  const p1 = new Vector(innerWidth / 2 + 100, innerHeight / 3 + 200);
  const a1 = new Vector(innerWidth / 2, innerHeight / 3);
  const b1 = new Body(p1, v, r, mass, d, color);
  const sp1 = new Spring(a1, 300, 0.99, color, 1);
  const s1 = new System(sp1, b1);

  const p2 = new Vector(innerWidth / 2 - 100, innerHeight / 3 + 300);
  const a2 = b1.position;
  const b2 = new Body(p2, v, r, mass, d, color);
  const sp2 = new Spring(a2, 300, 0.99, color, 1);
  const s2 = new System(sp2, b2);

  systems.push(s1);
  systems.push(s2);

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  requestAnimationFrame(anime);
}

init();

import Pendulum from "./Pendulum";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = 0.5;
const penduli = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  penduli.forEach((pen) => {
    pen.move(gravity);
    pen.draw(context);
  });

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const number = 5;
  const origin = new Vector(innerWidth / 2, innerHeight / number);
  const angle = Math.PI / 4;
  const damping = 1;
  const armLength = 100;
  const bobRadius = 10;

  for (let i = 0; i < number; i++) {
    const pivot = penduli.at(-1)?.bobPosition || origin;

    const sign = i % 2 ? 1 : -1;
    const pendulum = new Pendulum(
      pivot,
      angle * sign + i / 5 ,
      damping,
      armLength * (1 + i / 5),
      bobRadius
    );

    penduli.push(pendulum);
  }

  requestAnimationFrame(anime);
}

init();

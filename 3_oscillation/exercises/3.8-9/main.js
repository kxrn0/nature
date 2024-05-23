import Oscillator from "./Oscillator";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const oscillators = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let oscillator of oscillators) {
    oscillator.move();
    oscillator.draw(context);
  }

  requestAnimationFrame(anime);
}

function init() {
  const dA = (Math.PI * 2) / 10;
  const distance = 100;
  const center = new Vector(innerWidth / 2, innerHeight / 2);
  const angle = new Vector(0, 0);
  const angularVelocity = new Vector(0, 0);
  const angularAcceleration = new Vector(0, 0);
  const amplitude = 50;
  for (let a = 0; a < Math.PI * 2; a += dA) {
    const offset = new Vector(distance * Math.cos(a), distance * Math.sin(a));
    const anchor = Vector.add(center, offset);
    const oscillator = new Oscillator(
      anchor,
      angle,
      angularVelocity,
      angularAcceleration,
      amplitude
    );

    oscillators.push(oscillator);
  }

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("mousemove", (event) => {
    const mouse = new Vector(event.clientX, event.clientY);

    for (let oscillator of oscillators) {
      const diff = Vector.add(mouse, oscillator.angle.clone().scale(-1));

      diff.scale(1 / 10000);

      console.log(diff);

      oscillator.angle.add(diff);
    }
  });

  requestAnimationFrame(anime);
}

init();

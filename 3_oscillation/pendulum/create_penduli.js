import Pendulum from "./Pendulum";
import Vector from "./Vector";

export default function create_penduli(number, angle) {
  const minLength = 100;
  const step = innerWidth / (number + 1);
  const height = innerHeight / 3;
  const penduli = [];

  for (let i = 0; i < number; i++) {
    const pivot = new Vector(step * (i + 1), height);
    const damping = 0.99;
    const length = minLength * (1 + i / number);
    const bobRadius = 15;
    const pendulum = new Pendulum(pivot, angle, damping, length, bobRadius);

    penduli.push(pendulum);
  }

  return penduli;
}

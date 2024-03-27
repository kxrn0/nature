import random from "./random";
import Vector from "./Vector";
import Asteroid from "./Asteroid";

export default function add_asteroid(position, vr, p, asteroids, canvas) {
  const rnd = random(0, 1);

  if (rnd > p) return;

  const velocity = new Vector(random(-vr, vr), random(-vr, vr));
  const radius = random(25, 50);
  const asteroid = new Asteroid(position, velocity, radius, canvas);

  asteroids.push(asteroid);
}

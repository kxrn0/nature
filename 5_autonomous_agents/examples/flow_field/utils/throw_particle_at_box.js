import Vector from "../components/Vector.js";
import random from "./random.js";

export default function throw_particle_at_box(particle, box, strength) {
  const rnd = ~~random(0, 4);
  let x, y, v;

  switch (rnd) {
    case 0:
      x = box.corner.x + random(0, box.width);
      y = box.corner.y;
      v = new Vector(0, strength);
      break;
    case 1:
      x = box.corner.x + box.width;
      y = box.corner.y + random(0, box.height);
      v = new Vector(-strength, 0);
      break;
    case 2:
      x = box.corner.x + random(0, box.width);
      y = box.corner.y + box.height;
      v = new Vector(0, -strength);
      break;
    case 3:
      x = box.corner.x;
      y = box.corner.y + random(0, box.height);
      v = new Vector(strength, 0);
  }

  particle.position.set(x, y);
  particle.velocity.copy(v);
}

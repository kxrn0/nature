import Vector from "./Vector";
import collide from "./collide";

export default function handle_collision(a, b) {
  if (!collide(a, b)) return;

  const c = Vector.add(b.position, a.position.copy().scale(-1)).normalize();
  const vR = Vector.add(a.velocity, b.velocity.copy().scale(-1));
  const speed = Vector.dot(c, vR);

  if (speed < 0) return;

  c.scale(speed);

  b.velocity.add(c);

  c.scale(-1);

  a.velocity.add(c);
}

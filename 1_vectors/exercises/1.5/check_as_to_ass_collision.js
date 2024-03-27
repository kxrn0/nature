import Vector from "./Vector";
import collide from "./collide";

export default function check_as_to_as_collision(a, b) {
  if (!collide(a, b)) return;

  const c = Vector.add(b.position, a.position.copy().scale(-1)).normalize();
  const vR = Vector.add(a.velocity, b.velocity.copy().scale(-1));
  const speed = Vector.dot(c, vR);

  if (speed < 0) return;

  const imp = (2 * speed) / (a.mass + b.mass);

  c.scale(imp);

  c.scale(-b.mass);

  a.velocity.add(c);

  c.scale(-a.mass / b.mass);

  b.velocity.add(c);
}

export default function collide(a, b) {
  const d =
    (a.position.x - b.position.x) * (a.position.x - b.position.x) +
    (a.position.y - b.position.y) * (a.position.y - b.position.y);
  const r = (a.radius + b.radius) * (a.radius + b.radius);

  if (d <= r) return true;

  return false;
}

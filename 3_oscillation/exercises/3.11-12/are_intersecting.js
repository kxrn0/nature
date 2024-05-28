export default function are_intersecting(a, b) {
  const d =
    (a.center.x - b.center.x) * (a.center.x - b.center.x) +
    (a.center.y - b.center.y) * (a.center.y - b.center.y);
  const r = (a.radius + b.radius) * (a.radius + b.radius);

  if (d <= r) return true;

  return false;
}

export default function is_point_in_circle(point, circle) {
  const d2 =
    (circle.center.x - point.x) * (circle.center.x - point.x) +
    (circle.center.y - point.y) * (circle.center.y - point.y);
  const r2 = circle.radius * circle.radius;

  return d2 <= r2;
}

export default function is_point_in_circle(point, circle) {
  const d2 =
    (point.x - circle.center.x) * (point.x - circle.center.x) +
    (point.y - circle.center.y) * (point.y - circle.center.y);
  const r2 = circle.radius * circle.radius;

  return d2 <= r2;
}

function is_point_in_circle(circle, point) {
  const d2 =
    (circle.position.x - point.x) * (circle.position.x - point.x) +
    (circle.position.y - point.y) * (circle.position.y - point.y);
  const r2 = circle.radius * circle.radius;

  return d2 <= r2;
}

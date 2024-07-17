function find_closest_point(segment, distance, point) {
  const corners = find_corners(segment, distance);
  const isIn = is_point_in_rect(corners, point);

  if (!isIn) return null;

  const { start, end } = segment;
  const { x, y } = point;
  const n = end.y - start.y;
  const d = end.x - start.x;

  if (n === 0) return new Vector(x, start.y);
  else if (d === 0) return new Vector(start.x, y);
  else {
    const m = n / d;
    const a = m;
    const b = -1;
    const c = start.y - start.x * m;
    const cn = b * x - a * y;
    const cd = a * a + b * b;
    const cx = (b * cn - a * c) / cd;
    const cy = (-1 * a * cn - b * c) / cd;

    return new Vector(cx, cy);
  }
}

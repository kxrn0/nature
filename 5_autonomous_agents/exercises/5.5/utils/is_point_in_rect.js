function is_point_in_rect(corners, point) {
  const { a, b, c, d } = corners;
  const { x, y } = point;

  const edges = [
    { m: a, n: b },
    { m: b, n: c },
    { m: c, n: d },
    { m: d, n: a },
  ];

  return edges.every((edge) => {
    const { m, n } = edge;
    const d = (n.x - m.x) * (y - m.y) - (x - m.x) * (n.y - m.y);

    return d >= 0;
  });
}

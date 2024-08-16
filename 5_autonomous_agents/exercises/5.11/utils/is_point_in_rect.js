export default function is_point_in_rect(corners, point) {
  const edges = [
    { a: corners.a, b: corners.b },
    { a: corners.b, b: corners.c },
    { a: corners.c, b: corners.d },
    { a: corners.d, b: corners.a },
  ];

  return edges.every((edge) => {
    const { a, b } = edge;
    const d = (b.x - a.x) * (point.y - a.y) - (point.x - a.x) * (b.y - a.y);

    return d >= 0;
  });
}

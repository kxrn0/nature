function find_closest(point, params) {
  const d = params.a * params.a + params.b * params.b;
  const c = params.b * point.x - params.a * point.y;
  const x = (params.b * c - params.a * params.c) / d;
  const y = (-1 * params.a * c - params.b * params.c) / d;

  return { x, y };
}

function get_linear_equation(start, end) {
  const run = end.x - start.x;

  if (run === 0) return start.y;

  const rise = end.y - start.y;
  const slope = rise / run;
  const intersection = start.y - slope * start.x;

  return (x) => slope * x + intersection;
}

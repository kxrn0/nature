function get_random_point_in_seggs(start, end) {
  const line = get_linear_equation(start, end);
  const x = random(start.x, end.x);
  const y = line(x);

  return new Vector(x, y);
}

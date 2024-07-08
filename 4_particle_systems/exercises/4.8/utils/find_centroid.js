function find_centroid(vertices) {
  const area = find_area(vertices);
  let cx, cy, i, c;

  cx = cy = i = c = 0;

  while (c++ < vertices.length) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];

    cx += (a.x + b.x) * (a.x * b.y - b.x * a.y);
    cy += (a.y + b.y) * (a.x * b.y - b.x * a.y);

    i++;
  }

  cx /= 6 * area;
  cy /= 6 * area;

  return new Vector(cx, cy);
}

function find_area(vertices, dir) {
  let area, i, c;

  area = i = c = 0;
  while (c++ < vertices.length) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];

    area += a.x * b.y - a.y * b.x;

    i++;
  }

  area /= 2 * dir;

  return area;
}

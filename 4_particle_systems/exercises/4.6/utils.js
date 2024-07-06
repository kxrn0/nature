function random(min, max) {
  return Math.random() * (max - min) + min;
}

function random_rgb() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

function map(value, minFrom, maxFrom, minTo, maxTo) {
  return ((maxTo - minTo) * (value - minFrom)) / (maxFrom - minFrom);
}

function get_random_divisions(start, end, totalSegments) {
  const points = new Array(totalSegments + 1);
  const length = end - start;
  const size = length / totalSegments;
  const minDist = size / 3;

  points[0] = start;

  for (let i = 1; i < points.length - 1; i++) {
    let point;

    while (true) {
      const a = i * size;
      const b = (i + 1) * size;

      point = random(a, b);

      if (i === points.length - 2 && end - point < minDist) continue;

      if (point - points[i - 1] >= minDist) break;
    }

    points[i] = point;
  }

  points[points.length - 1] = end;

  return points;
}

function create_polygon(origin, minSides, maxSides, minRadius, maxRadius) {
  const totalSides = Math.round(random(minSides, maxSides));
  const degrees = Math.PI * 2;
  const divisions = get_random_divisions(0, degrees, totalSides);
  const vertices = [];

  divisions.splice(divisions.length - 1, 1);

  for (let angle of divisions) {
    const radius = random(minRadius, maxRadius);
    const point = { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };

    point.x += origin.x;
    point.y += origin.y;

    vertices.push(point);
  }

  return vertices;
}

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

function find_centroid(vertices, dir) {
  const area = find_area(vertices, dir);
  let cx, cy, i, c;

  cx = cy = i = c = 0;

  while (c++ < vertices.length) {
    const a = vertices[i];
    const b = vertices[(i + 1) % vertices.length];

    cx += (a.x + b.x) * (a.x * b.y - b.x * a.y);
    cy += (a.y + b.y) * (a.x * b.y - b.x * a.y);

    i++;
  }

  cx /= 6 * area * dir;
  cy /= 6 * area * dir;

  return {
    x: cx,
    y: cy,
  };
}

function get_slices(vertices, line) {
  const veretrices = vertices.flatMap((vertex) => [vertex.x, vertex.y]);
  try {
    const polygons = Slice(
      veretrices,
      line.p1.x,
      line.p1.y,
      line.p2.x,
      line.p2.y
    ).map((polygon) => {
      const points = [];

      for (let i = 0; i < polygon.length - 1; i += 2)
        points.push({ x: polygon[i], y: polygon[i + 1] });

      return points;
    });

    return polygons;
  } catch (error) {
    console.log(error);

    return [vertices];
  }
}

function get_linear_equation(start, end) {
  const run = end.x - start.x;

  if (run === 0) return start.y;

  const rise = end.y - start.y;
  const slope = rise / run;
  const intersection = start.y - slope * start.x;

  return (x) => slope * x + intersection;
}

function get_random_point_in_seggs(start, end) {
  const line = get_linear_equation(start, end);
  const x = random(start.x, end.x);
  const y = line(x);

  return { x, y };
}

function fill_polygon(context, vertices, color) {
  context.beginPath();
  context.fillStyle = color;
  context.moveTo(vertices[0].x, vertices[0].y);

  for (let i = 1; i < vertices.length; i++)
    context.lineTo(vertices[i].x, vertices[i].y);

  context.fill();
}

function stroke_polygon(context, vertices, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(vertices[0].x, vertices[0].y);

  for (let i = 1; i < vertices.length; i++)
    context.lineTo(vertices[i].x, vertices[i].y);

  context.stroke();
}

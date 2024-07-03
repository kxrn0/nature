function random(min, max) {
  return Math.random() * (max - min) + min;
}

function random_rgb() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

function is_point_in_circle(point, circle) {
  const d2 =
    (circle.center.x - point.x) * (circle.center.x - point.x) +
    (circle.center.y - point.y) * (circle.center.y - point.y);
  const r2 = circle.radius * circle.radius;

  return d2 <= r2;
}

function get_shards(vertices, line) {
  const veretrices = vertices.reduce((array, vertex) => {
    array.push(vertex.x, vertex.y);

    return array;
  }, []);
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

function fill_polygon(context, points, color) {
  context.beginPath();
  context.fillStyle = color;

  context.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++)
    context.lineTo(points[i].x, points[i].y);

  context.fill();
}

function stroke_vertices(context, points, radius) {
  for (let point of points) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.stroke();
  }
}

function stroke_line(context, line) {
  context.beginPath();
  context.moveTo(line.p1.x, line.p1.y);
  context.lineTo(line.p2.x, line.p2.y);
  context.stroke();
}

function draw_line(context, line, radius) {
  stroke_line(context, line);
  stroke_vertices(context, [line.p1, line.p2], radius);
}

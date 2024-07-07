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

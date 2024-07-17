function seg_point_dist(segment, point) {
  const n = Math.abs(
    point.x * (segment.end.y - segment.start.y) -
      point.y * (segment.end.x - segment.start.x) +
      segment.end.x * segment.start.y -
      segment.end.y * segment.start.x
  );
  const d = dist(segment.start, segment.end);

  return n / d;
}

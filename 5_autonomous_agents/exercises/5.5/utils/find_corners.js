function find_corners(segment, height) {
  let { start, end } = segment;

  if (end.x < start.x) {
    const temp = end;

    end = start;
    start = temp;
  }

  const offset = Vector.from_segment(start, end).set_size(height / 2);

  offset.set_angle(offset.angle() - Math.PI / 2);

  const a = Vector.add(start, offset);
  const b = Vector.add(end, offset);
  const c = Vector.sub(end, offset);
  const d = Vector.sub(start, offset);

  return { a, b, c, d };
}

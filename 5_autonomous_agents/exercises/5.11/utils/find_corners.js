export default function find_corners(line, height) {
  let start, end;

  start = line.start;
  end = line.end;

  if (end.x < start.x) {
    const temp = end;

    end = start;
    start = temp;
  }

  const rise = end.y - start.y;
  const run = end.x - start.x;
  const angle = Math.atan2(rise, run) - Math.PI / 2;
  const size = height / 2;
  const vector = { x: size * Math.cos(angle), y: size * Math.sin(angle) };
  const a = { x: start.x + vector.x, y: start.y + vector.y };
  const b = { x: end.x + vector.x, y: end.y + vector.y };
  const c = { x: end.x - vector.x, y: end.y - vector.y };
  const d = { x: start.x - vector.x, y: start.y - vector.y };

  return { a, b, c, d };
}

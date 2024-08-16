export default function get_closest_point(t, a, b) {
  const d2a = (t.x - a.x) * (t.x - a.x) + (t.y - a.y) * (t.y - a.y);
  const d2b = (t.x - b.x) * (t.x - b.x) + (t.y - b.y) * (t.y - b.y);

  return d2a < d2b ? a : b;
}

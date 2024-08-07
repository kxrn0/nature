export default function is_between(p, a, b) {
  const bndInX = Math.min(a.x, b.x) <= p.x && p.x <= Math.max(a.x, b.x);
  const bndInY = Math.min(a.y, b.y) <= p.y && p.y <= Math.max(a.y, b.y);

  return bndInX && bndInY;
}

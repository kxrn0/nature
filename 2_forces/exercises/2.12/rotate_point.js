export default function rotate_point(point, angle, pivot = { x: 0, y: 0 }) {
  const dx = point.x - pivot.y;
  const dy = point.y - pivot.y;

  const mag = Math.sqrt(dx * dx + dy * dy);
  const start = Math.atan2(dy, dx);

  point.x = mag * Math.cos(start + angle) + pivot.x;
  point.y = mag * Math.sin(start + angle) + pivot.y;
}

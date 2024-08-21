export default function is_point_in_sector(
  point,
  center,
  radius,
  startAngle,
  endAngle
) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const distanceSquared = dx * dx + dy * dy;

  if (distanceSquared > radius * radius) return false;

  let angle = Math.atan2(dy, dx);

  if (angle < 0) angle += 2 * Math.PI;

  startAngle = startAngle % (2 * Math.PI);
  endAngle = endAngle % (2 * Math.PI);

  if (startAngle < 0) startAngle += 2 * Math.PI;
  if (endAngle < 0) endAngle += 2 * Math.PI;

  if (startAngle < endAngle) return angle >= startAngle && angle <= endAngle;
  else return angle >= startAngle || angle <= endAngle;
}

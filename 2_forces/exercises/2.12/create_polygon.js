export default function create_polygon(sides, radius, center, angle = 0) {
  const points = [];
  const dt = (Math.PI * 2) / sides;

  for (let t = 0; t < Math.PI * 2; t += dt) {
    const x = radius * Math.cos(t + angle) + center.x;
    const y = radius * Math.sin(t + angle) + center.y;

    points.push({ x, y });
  }

  if (points.length > sides) points.pop();

  return points;
}

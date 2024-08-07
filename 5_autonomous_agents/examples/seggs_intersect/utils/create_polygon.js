import Vector from "../components/Vector.js";

export default function create_polygon(center, radius, sides, dA) {
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle = (2 * i * Math.PI) / sides - dA;
    const x = radius * Math.cos(angle) + center.x;
    const y = radius * Math.sin(angle) + center.y;
    const point = new Vector(x, y);

    points.push(point);
  }

  return points;
}

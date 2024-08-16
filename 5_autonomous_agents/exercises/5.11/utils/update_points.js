import Vector from "../components/Vector.js";

export default function update_points(points, center, minRad, maxRad, t) {
  for (let i = 0; i < points.length; i++) {
    const angle = (i * Math.PI * 2) / points.length;
    const fun = i % 2 ? Math.sin : Math.cos;
    const radius = minRad + ((maxRad - minRad) * (fun(t) + 1)) / 2;
    const x = radius * Math.cos(angle) + center.x;
    const y = radius * Math.sin(angle) + center.y;

    if (!points[i]) points[i] = new Vector(x, y);
    else points[i].set(x, y);
  }
}

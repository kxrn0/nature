import get_random_divisions from "./get_random_divisions.js";
import random from "./random.js";
import Vector from "../components/Vector.js";

export default function create_random_polygon(
  origin,
  minSides,
  maxSides,
  minRadius,
  maxRadius
) {
  const totalSides = Math.round(random(minSides, maxSides));
  const degrees = Math.PI * 2;
  const divisions = get_random_divisions(0, degrees, totalSides);
  const vertices = [];

  divisions.splice(divisions.length - 1, 1);

  for (let angle of divisions) {
    const radius = random(minRadius, maxRadius);
    const point = new Vector(
      radius * Math.cos(angle),
      radius * Math.sin(angle)
    );

    point.add(origin);

    vertices.push(point);
  }

  return vertices;
}

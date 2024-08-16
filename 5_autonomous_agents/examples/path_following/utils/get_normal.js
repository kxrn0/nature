import Vector from "../components/Vector.js";

export default function get_normal(point, start, end) {
  const vA = Vector.sub(point, start);
  const vB = Vector.sub(end, start);

  vB.normalize();
  vB.scale(vA.dot(vB));

  const normal = Vector.add(start, vB);

  return normal;
}

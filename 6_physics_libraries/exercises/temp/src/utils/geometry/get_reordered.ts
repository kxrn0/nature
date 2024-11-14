import Matter from "matter-js";
import find_centroid from "./find_centroid";

export default function get_reordered(vertices: Matter.Vector[]) {
  vertices = vertices.map((v) => structuredClone(v));

  const centroid = find_centroid(vertices);

  vertices.sort((p1, p2) => {
    const a = Math.atan2(p1.x - centroid.x, p1.y - centroid.y);
    const b = Math.atan2(p2.x - centroid.x, p2.y - centroid.y);

    return b - a;
  });

  return vertices;
}

import Matter from "matter-js";

export default function find_centroid(vertices: Matter.Vector[]) {
  const point = { x: 0, y: 0 };

  for (let i = 0; i < vertices.length; i++) {
    point.x += vertices[i].x;
    point.y += vertices[i].y;
  }

  point.x /= vertices.length;
  point.y /= vertices.length;

  return point;
}

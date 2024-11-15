import Matter from "matter-js";

export default function find_bb_dimensions(vertices: Matter.Vector[]) {
  const xMin = Math.min(...vertices.map((v) => v.x));
  const xMax = Math.max(...vertices.map((v) => v.x));
  const yMin = Math.min(...vertices.map((v) => v.y));
  const yMax = Math.max(...vertices.map((v) => v.y));
  const width = xMax - xMin;
  const height = yMax - yMin;
  const center = { x: xMin + width / 2, y: yMin + height / 2 };
  const box = {
    width,
    height,
    center,
  };

  return box;
}

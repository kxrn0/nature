import Matter from "matter-js";

export default function is_point_in_circle(
  point: Matter.Vector,
  center: Matter.Vector,
  radius: number
) {
  const d2 = (center.x - point.x) ** 2 + (center.y - point.y) ** 2;
  const r2 = radius ** 2;

  return d2 <= r2;
}

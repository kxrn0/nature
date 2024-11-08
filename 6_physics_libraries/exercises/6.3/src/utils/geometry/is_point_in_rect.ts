import Matter from "matter-js";

type Rect = {
  corner: Matter.Vector;
  width: number;
  height: number;
};

export default function is_point_in_rect(point: Matter.Vector, rect: Rect) {
  const x = rect.corner.x <= point.x && point.x <= rect.corner.x + rect.width;
  const y = rect.corner.y <= point.y && point.y <= rect.corner.y + rect.height;

  return x && y;
}

import is_point_in_rect from "./is_point_in_rect";

export default function are_rects_colliding(a, b) {
  const cornersA = [
    { x: a.corner.x, y: a.corner.y },
    { x: a.corner.x + a.width, y: a.corner.y },
    { x: a.corner.x + a.width, y: a.corner.y + a.height },
    { x: a.corner.x, y: a.corner.y + a.height },
  ];
  const cornersB = [
    { x: b.corner.x, y: b.corner.y },
    { x: b.corner.x + b.width, y: b.corner.y },
    { x: b.corner.x + b.width, y: b.corner.y + b.height },
    { x: b.corner.x, y: b.corner.y + b.height },
  ];

  return (
    cornersA.some((corner) => is_point_in_rect(corner, b)) ||
    cornersB.some((corner) => is_point_in_rect(corner, a))
  );
}

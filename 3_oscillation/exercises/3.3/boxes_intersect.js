import Vector from "./Vector";
import point_in_box from "./point_in_box";

export default function boxes_intersect(a, b) {
  const one = [
    a.corner,
    new Vector(a.corner.x + a.width, a.corner.y),
    new Vector(a.corner.x + a.width, a.corner.y + a.height),
    new Vector(a.corner.x, a.corner.y + a.height),
  ];
  const two = [
    b.corner,
    new Vector(b.corner.x + b.width, b.corner.y),
    new Vector(b.corner.x + b.width, b.corner.y + b.height),
    new Vector(b.corner.x, b.corner.y + b.height),
  ];

  console.log({ one, two });

  const x = one.some((point) => point_in_box(point, b));
  const y = two.some((point) => point_in_box(point, a));

  return x || y;
}

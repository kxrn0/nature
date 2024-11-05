function find_center(polygon) {
  const point = { x: 0, y: 0 };

  for (let i = 0; i < polygon.length; i++) {
    point.x += polygon[i].x;
    point.y += polygon[i].y;
  }

  point.x /= polygon.length;
  point.y /= polygon.length;

  return point;
}

function rearrange(polygon) {
  const center = find_center(polygon);

  polygon.sort((p1, p2) => {
    const a = Math.atan2(p1.y - center.y, p1.x - center.x);
    const b = Math.atan2(p2.y - center.y, p2.x - center.y);

    return a - b;
  });
}

const r1 = [
  { x: 2, y: 3 },
  { x: 3, y: 2 },
  { x: 1, y: 1 },
  { x: 1, y: 3 },
];
const b1 = [
  { x: 2, y: 3 },
  { x: 1, y: 3 },
  { x: 1, y: 1 },
  { x: 3, y: 2 },
];

const r2 = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 1 },
];
const b2 = [
  { x: 1, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
  { x: 1, y: -1 },
];

const r3 = [
  { x: 4, y: 4 },
  { x: 3, y: 2 },
  { x: 1, y: 1 },
  { x: 2, y: 3 },
];
const b3 = [
  { x: 4, y: 4 },
  { x: 2, y: 3 },
  { x: 1, y: 1 },
  { x: 3, y: 2 },
];

const r4 = [
  { x: 2, y: 4 },
  { x: 3, y: 2 },
  { x: 2, y: 1 },
  { x: 1, y: 2 },
];
const b4 = [
  { x: 2, y: 4 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 2 },
];

const r5 = [
  { x: 0, y: 4 },
  { x: 2, y: 3 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
];
const b5 = [
  { x: 0, y: 4 },
  { x: 1, y: 2 },
  { x: 3, y: 1 },
  { x: 2, y: 3 },
];

const r = [r1, r2, r3, r4, r5];
const b = [b1, b2, b3, b4, b5];
const fun = (a) =>
  a.forEach((p) => {
    rearrange(p);

    console.log(p);
  });

fun(r);
console.log("---------------");
fun(b);

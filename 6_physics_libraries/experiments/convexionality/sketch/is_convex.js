function is_convex(polygon) {
  if (polygon.length < 3) return false;

  const PI = Math.PI;
  const TWO_PI = PI * 2;
  let { x: oldX, y: oldY } = polygon.at(-2);
  let { x: newX, y: newY } = polygon.at(-1);
  let newDirection = Math.atan2(newY - oldY, newX - oldX);
  let angleSum = 0;
  let oldDirection, orientation;

  for (let i = 0; i < polygon.length; i++) {
    const point = polygon[i];

    oldX = newX;
    oldY = newY;
    oldDirection = newDirection;

    newX = point.x;
    newY = point.y;
    newDirection = Math.atan2(newY - oldY, newX - oldX);

    if (oldX === newX && oldY === newY) return false;

    let angle = newDirection - oldDirection;

    if (angle <= -PI) angle += TWO_PI;
    else if (angle > PI) angle -= TWO_PI;

    if (i) {
      if (orientation * angle <= 0) return false;
    } else {
      if (!angle) return false;

      orientation = angle > 0 ? 1 : -1;
    }

    angleSum += angle;
  }

  return Math.abs(Math.round(angleSum / TWO_PI)) === 1;
}

const p1 = [
  { x: 1, y: 1 },
  { x: 3, y: 2 },
  { x: 2, y: 3 },
  { x: 1, y: 3 },
];
const p2 = [
  { x: 1, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 2 },
];
const p3 = [
  { x: 4, y: 0 },
  { x: 5, y: -1 },
  { x: 7, y: 1 },
  { x: 5, y: 1 },
  { x: 4, y: 2 },
];
const p4 = [
  { x: 4, y: 0 },
  { x: 4, y: 2 },
  { x: 5, y: 1 },
  { x: 7, y: 1 },
  { x: 5, y: -1 },
];
const p5 = [
  { x: 3, y: 4 },
  { x: 5, y: 4 },
  { x: 4, y: 6 },
  { x: 4, y: 3 },
];
const p6 = [
  { x: 3, y: 4 },
  { x: 4, y: 3 },
  { x: 4, y: 6 },
  { x: 5, y: 4 },
];

const ps = [p1, p2, p3, p4, p5, p6];

for (let p of ps) console.log(is_convex(p));

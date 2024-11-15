import Matter from "matter-js";

export default function is_convex(vertices: Matter.Vector[]) {
  if (vertices.length < 3) return false;

  const PI = Math.PI;
  const TWO_PI = PI * 2;
  let { x: oldX, y: oldY } = vertices.at(-2)!;
  let { x: newX, y: newY } = vertices.at(-1)!;
  let newDirection, angleSum, oldDirection, orientation;

  newDirection = Math.atan2(newY - oldY, newX - oldX);
  angleSum = 0;
  orientation = 1;

  for (let i = 0; i < vertices.length; i++) {
    const point = vertices[i];

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

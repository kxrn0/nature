export default function are_colliding(circle1, circle2) {
  const dx = circle1.position.x - circle2.position.x;
  const dy = circle1.position.y - circle2.position.y;
  const distance = dx * dx + dy * dy;
  const radialSum = circle1.radius + circle2.radius;

  return distance <= radialSum * radialSum;
}

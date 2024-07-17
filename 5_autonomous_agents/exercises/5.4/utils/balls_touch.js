function balls_touch(ball1, ball2) {
  const dist2 =
    (ball1.center.x - ball2.center.x) * (ball1.center.x - ball2.center.x) +
    (ball1.center.y - ball2.center.y) * (ball1.center.y - ball2.center.y);
  const rad2 = (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius);

  return dist2 <= rad2;
}

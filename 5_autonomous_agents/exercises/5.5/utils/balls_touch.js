function balls_touch(ball1, ball2) {
  const { center: c1, radius: r1 } = ball1;
  const { center: c2, radius: r2 } = ball2;

  const dist2 = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
  const rad2 = (r1 + r2) * (r1 + r2);

  return dist2 <= rad2;
}

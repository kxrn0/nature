function get_random_gaussian(mean, sd) {
  const TWO_PI = Math.PI * 2;
  let u1, u2;

  while (!u1) u1 = Math.random();

  u2 = Math.random();

  const mag = sd * Math.sqrt(-2 * Math.log(u1));
  const z = mag * Math.cos(TWO_PI * u2) + mean;

  return z;
}

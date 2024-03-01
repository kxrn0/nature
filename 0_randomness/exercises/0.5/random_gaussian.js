/**
 * @param {number} mean
 * @param {number} sd
 * @returns number
 */
export default function random_gaussian(mean, sd) {
  let u, v;

  u = 0;
  v = 0;

  while (!u) u = Math.random(); // Converting [0,1) to (0,1)
  while (!v) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return mean + z * sd;
}

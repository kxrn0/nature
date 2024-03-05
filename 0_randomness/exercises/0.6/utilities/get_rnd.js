import random from "./random";

export default function get_rnd(min, max, fun, cond) {
  const maxCount = 1e3;
  let count;

  count = 0;

  while (count++ < maxCount) {
    const r0 = Math.abs(random(min, max));
    const p = fun(r0);
    const r1 = Math.abs(random(min, max));

    if (cond(r1, p)) {
      const s = random(0, 1) < 0.5 ? 1 : -1;

      return r1 * s;
    }
  }

  return 0;
}

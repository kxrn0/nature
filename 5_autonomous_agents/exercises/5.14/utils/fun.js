import random from "./random.js";

export default function fun(v, t) {
  const s = random(0, 100) < 50 ? 1 : -1;
  const r = v * (1 + s * t);

  return r <= 0 ? v : r;
}

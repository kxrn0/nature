import dist from "./dist.js";

export default function is_between(p, a, b, f = 3) {
  const total = Number(dist(a, b).toFixed(f));
  const da = dist(p, a);
  const db = dist(p, b);
  const sum = Number((da + db).toFixed(f));

  return sum <= total;
}

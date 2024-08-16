import are_counterclockwise from "./are_counterclockwise.js";

export default function are_intersecting(sA, sB) {
  const { start: a, end: b } = sA;
  const { start: c, end: d } = sB;
  const ca = are_counterclockwise(a, c, d);
  const cb = are_counterclockwise(b, c, d);
  const cc = are_counterclockwise(a, b, c);
  const cd = are_counterclockwise(a, b, d);

  return ca !== cb && cc !== cd;
}

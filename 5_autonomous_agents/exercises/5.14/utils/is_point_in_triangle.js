import sign from "./sign.js";

export default function is_point_in_triangle(p, v1, v2, v3) {
  const d1 = sign(p, v1, v2);
  const d2 = sign(p, v2, v3);
  const d3 = sign(p, v3, v1);
  const has_neg = d1 < 0 || d2 < 0 || d3 < 0;
  const has_pos = d1 > 0 || d2 > 0 || d3 > 0;

  return !(has_neg && has_pos);
}

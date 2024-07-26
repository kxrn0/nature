import Vector from "../components/Vector.js";
import map from "./map.js";

export default function get_average(x, y, values, scale) {
  const currentValue = values.pixels[x + y * values.cols];
  let sx, sy;

  sx = 0;
  sy = 0;

  for (let dx = -1; dx < 2; dx++) {
    for (let dy = -1; dy < 2; dy++) {
      const ix = x + dx;
      const iy = y + dy;

      if (ix === x && iy === y) continue;

      if (0 <= ix && ix < values.cols && 0 <= iy && iy < values.rows) {
        const value = values.pixels[ix + iy * values.cols];
        const angle = Math.atan2(ix - x, iy - y);
        const diff = value - currentValue;
        const dir = diff > 0 ? 1 : -1;
        const mag = map(Math.abs(diff), 0, 255, 0, scale);

        sx += dir * mag * Math.cos(angle);
        sy += dir * mag * Math.sin(angle);
      }
    }
  }

  return new Vector(sx, sy);
}

import Vector from "./Vector";

export default function check_edges(mover, boundaries, strength, threshold) {
  const dxl = mover.position.x - boundaries.x.min;
  const dxr = boundaries.x.max - mover.position.x;
  const dyt = mover.position.y - boundaries.y.min;
  const dyb = boundaries.y.max - mover.position.y;

  if (dxl < threshold) {
    if (dxl > 0) {
      const mag = strength / Math.abs(dxl);
      const v = new Vector(1, 0).scale(mag);

      mover.apply_force(v);
    } else {
      const v = new Vector(strength, 0);

      mover.apply_force(v);
    }
  }

  if (dxr < threshold) {
    if (dxr > 0) {
      const mag = strength / Math.abs(dxr);
      const v = new Vector(-1, 0).scale(mag);

      mover.apply_force(v);
    } else {
      const v = new Vector(-strength, 0);

      mover.apply_force(v);
    }
  }

  if (dyt < threshold) {
    if (dyt > 0) {
      const mag = strength / Math.abs(dyt);
      const v = new Vector(0, 1).scale(mag);

      mover.apply_force(v);
    } else {
      const v = new Vector(0, strength);

      mover.apply_force(v);
    }
  }

  if (dyb < threshold) {
    if (dyb > 0) {
      const mag = strength / Math.abs(dyb);
      const v = new Vector(0, -1).scale(mag);

      mover.apply_force(v);
    } else {
      const v = new Vector(0, -strength);

      mover.apply_force(v);
    }
  }
}

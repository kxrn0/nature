import Vector from "./Vector";

export default function force_mover(mover, mouse, strength, direction) {
  const director = Vector.add(
    mouse,
    mover.position.copy().scale(-1)
  ).normalize();
  const mag = director.get_length();

  director.scale((strength * direction) / (mag || 1));

  mover.apply_force(director);
}

import Vector from "../components/Vector.js";

export default function world_to_screen(offset, scale, world, screen) {
  screen.copy(Vector.sub(world, offset)).mult(scale);
}

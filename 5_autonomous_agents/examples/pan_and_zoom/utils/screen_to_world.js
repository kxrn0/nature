import Vector from "../components/Vector.js";

export default function screen_to_world(offset, scale, screen, world) {
  world.copy(screen.clone().div(scale)).add(offset);
}

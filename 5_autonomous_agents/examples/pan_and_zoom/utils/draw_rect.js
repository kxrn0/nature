import Vector from "../components/Vector.js";
import world_to_screen from "./world_to_screen.js";

export default function draw_rect(
  context,
  worldCorner,
  worldWidth,
  worldHeight,
  scale,
  offset
) {
  const width = scale.x * worldWidth;
  const height = scale.y * worldHeight;
  const corner = new Vector(0, 0);

  world_to_screen(offset, scale, worldCorner, corner);

  context.fillStyle = "black";
  context.fillRect(corner.x, corner.y, width, height);
}

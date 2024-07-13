export default function draw_radial_gradient(
  context: CanvasRenderingContext2D,
  position: { x: number; y: number },
  radius: number,
  color: string
) {
  const gradient = context.createRadialGradient(
    position.x,
    position.y,
    0,
    position.x,
    position.y,
    radius
  );

  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "#ffffff00");

  context.fillStyle = gradient;
  context.fillRect(
    position.x - radius,
    position.y - radius,
    radius * 2,
    radius * 2
  );
}

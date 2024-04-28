export default function draw_a_box(mouse, context, size) {
  const mid = size / 2;
  const x = mouse.x - mid;
  const y = mouse.y - mid;

  context.beginPath();
  context.strokeStyle = "red";
  context.rect(x, y, size, size);
  context.stroke();
}

export default function draw_vector(context, vector, root) {
  const size = vector.size();
  const size5 = size / 5;
  const size45 = 4.5 * size5;
  const size52 = size5 / 2;

  context.beginPath();
  context.translate(root.x, root.y);
  context.rotate(vector.angle());
  context.moveTo(0, 0);
  context.lineTo(size, 0);
  context.lineTo(size45, size52);
  context.lineTo(size, 0);
  context.lineTo(size45, -size52);
  context.stroke();
  context.setTransform(1, 0, 0, 1, 0, 0);
}

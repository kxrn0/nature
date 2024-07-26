export default function draw_field(context, center, field) {
  const width = field.cols * field.scale;
  const height = field.rows * field.scale;

  const corner = center.clone().sub({ x: width / 2, y: height / 2 });

  for (let y = 0; y < field.rows; y++)
    for (let x = 0; x < field.cols; x++) {
      const vector = field.vectors[x + y * field.cols];
      const cx = field.scale * x + corner.x;
      const cy = field.scale * y + corner.y;
      const sx = cx - vector.x / 2;
      const sy = cy - vector.y / 2;
      const ex = cx + vector.x / 2;
      const ey = cy + vector.y / 2;
      const up = vector
        .clone()
        .set_angle(vector.angle() - 2.5)
        .scale(1 / 5);
      const down = vector
        .clone()
        .set_angle(vector.angle() + 2.5)
        .scale(1 / 5);

      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(ex, ey);

      context.lineTo(ex + up.x, ey + up.y);
      context.lineTo(ex, ey);
      context.lineTo(ex + down.x, ey + down.y);
      context.stroke();
    }
}

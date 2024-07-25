export default function draw_blur(context, center, blur, res) {
  const width = blur.cols * res;
  const height = blur.rows * res;
  const corner = { x: center.x - width / 2, y: center.y - height / 2 };

  for (let x = 0; x < blur.cols; x++)
    for (let y = 0; y < blur.rows; y++) {
      const index = x + y * blur.cols;

      context.fillStyle = blur.pixels[index];
      context.fillRect(corner.x + x * res, corner.y + y * res, res, res);
    }
}

import map from "./map";

export default function draw_perlin(canvas, context, noise2d, scale) {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const n = noise2d(x / scale, y / scale);
      const br = map(n, -1, 1, 0, 255);
      const index = 4 * (x + y * canvas.width);

      data[index] = br;
      data[index + 1] = br;
      data[index + 2] = br;
      data[index + 3] = 255;
    }
  }
  context.putImageData(imageData, 0, 0);
}

import map from "./map";

export default function draw_perlin(canvas, noise3D, dx, dy, z) {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let x = 0, xOff = 0; x < canvas.width; x++, xOff += dx) {
    for (let y = 0, yOff = 0; y < canvas.height; y++, yOff += dy) {
      const n = noise3D(xOff, yOff, z);
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

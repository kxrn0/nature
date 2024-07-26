export default function create_value_map(img, res) {
  const { naturalWidth: width, naturalHeight: height } = img;
  const dw = width % res;
  const dh = height % res;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const res2 = res * res;

  canvas.width = width + dw;
  canvas.height = height + dh;

  context.drawImage(img, 0, 0);

  const cols = ~~(canvas.width / res);
  const rows = ~~(canvas.height / res);
  const valueData = { pixels: [], rows, cols };
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const start = 4 * res * (x + y * canvas.width);
      let r, g, b;

      r = g = b = 0;

      for (let dx = 0; dx < res; dx++)
        for (let dy = 0; dy < res; dy++) {
          const i = start + 4 * (dx + dy * canvas.width);

          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

      r /= res2;
      g /= res2;
      b /= res2;

      const value = (r + g + b) / 3;

      valueData.pixels.push(value);
    }

  return valueData;
}

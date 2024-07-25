function set_perlin(vectors, resolution, cols, rows, zOff, noise) {
  const dt = 0.01;
  let xOff;

  xOff = 0;

  for (let x = 0; x < cols; x++) {
    let yOff;

    yOff = 0;

    for (let y = 0; y < rows; y++) {
      const value = noise(xOff, yOff, zOff);
      const angle = map(value, -1, 1, 0, Math.PI * 2);
      const vector = Vector.from_angle(angle, resolution);

      vectors[x][y] = vector;
      yOff += dt;
    }
    xOff += dt;
  }
}

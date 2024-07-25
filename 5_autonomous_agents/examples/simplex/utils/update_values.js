function update_values(grid, cols, rows, noise, dc, zOff) {
  let xOff;

  xOff = 0;
  for (let x = 0; x < cols; x++) {
    let yOff;

    yOff = 0;
    for (let y = 0; y < rows; y++) {
      const value = noise(xOff, yOff, zOff);
      const shade = map(value, -1, 1, 0, 255);

      grid[x][y] = shade;

      yOff += dc;
    }

    xOff += dc;
  }
}

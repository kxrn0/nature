function draw_grid(context, grid, cols, rows, resolution) {
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
      const s = grid[x][y];
      context.fillStyle = `rgb(${s}, ${s}, ${s})`;
      context.fillRect(x * resolution, y * resolution, resolution, resolution);
    }
}

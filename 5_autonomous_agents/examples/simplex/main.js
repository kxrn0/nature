const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const noise = createNoise3D();
const resolution = 10;
const rows = canvas.width / resolution;
const cols = canvas.height / resolution;
const grid = new Array(cols);
const dz = 0.005;
const dc = 0.05;
let zOff = 0;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  update_values(grid, cols, rows, noise, dc, zOff);
  draw_grid(context, grid, cols, rows, resolution);

  zOff += dz;

  requestAnimationFrame(anime);
}

function init() {
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) grid[x] = new Array(rows);

  update_values(grid, zOff);

  requestAnimationFrame(anime);
}

init();

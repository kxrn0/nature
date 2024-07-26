export default function get_neighbors(x, y, width, height, array) {
  const neighbors = [];

  for (let dy = -1; dy < 2; dy++)
    for (let dx = -1; dx < 2; dx++) {
      const ix = x + dx;
      const iy = y + dy;

      if (ix === x && iy === y)
        continue;

      if (0 <= ix && ix < width && 0 <= iy && iy < height)
        neighbors.push(array[ix + iy * width])
    }
  
  return neighbors;
}
function random_rgb() {
  const red = random(0, 255);
  const green = random(0, 255);
  const blue = random(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
}

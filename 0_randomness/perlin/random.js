export default function random(min, max) {
  if (max < min) {
    const temp = min;

    min = max;
    max = temp;
  }

  return Math.random() * (max - min) + min;
}

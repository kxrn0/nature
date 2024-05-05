export default function constrain(number, min, max) {
  if (number < min) return min;
  if (number > max) return max;

  return number;
}

export default function constrain(number: number, min: number, max: number) {
  if (number < min) return min;
  if (number > max) return max;

  return number;
}
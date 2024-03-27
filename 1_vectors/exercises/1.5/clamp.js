export default function clamp(value, from, to) {
  if (from > to) {
    const temp = to;

    to = from;
    from = temp;
  }

  if (value < from) return from;
  if (value > to) return to;

  return value;
}

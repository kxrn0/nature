export default function get_line(a, b) {
  const rise = b.y - a.y;
  const run = b.x - a.x;

  if (rise === 0) return () => a.y;

  if (run === 0) return () => a.x;

  const k = rise / run;
  const n = a.y - k * a.x;

  return (x) => k * x + n;
}

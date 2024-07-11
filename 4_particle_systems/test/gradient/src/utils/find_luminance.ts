function extract_components(rgb: string) {
  const reg = /rgb\((\d+), (\d+), (\d+)\)/;
  const match = reg.exec(rgb);

  if (!match) throw new Error("fuck!");

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function stolin(c: number) {
  if (c < 0.04045) return c / 12.92;
  else return Math.pow((c + 0.055) / 1.055, 2.4);
}

export default function find_luminance(rgb: string) {
  const [r, g, b] = extract_components(rgb).map((n) => stolin(n / 255));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

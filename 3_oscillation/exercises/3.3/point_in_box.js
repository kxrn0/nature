export default function point_in_box(point, box) {
  const a = box.corner.x <= point.x && point.x <= box.corner.x + box.width;
  const b = box.corner.y <= point.y && point.y <= box.corner.y + box.height;

  if (a && b) return true;

  return false;
}

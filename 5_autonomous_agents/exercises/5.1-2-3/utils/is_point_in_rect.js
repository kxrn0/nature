function is_point_in_rect(point, rect) {
  if (
    rect.corner.x < point.x &&
    point.x < rect.corner.x + rect.width &&
    rect.corner.y < point.y &&
    point.y < rect.corner.y + rect.height
  )
    return true;
  return false;
}

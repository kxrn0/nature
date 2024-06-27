function map(value, minFrom, maxFrom, minTo, maxTo) {
  return ((maxTo - minTo) * (value - minFrom)) / (maxFrom - minFrom);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function random_rgb() {
  const red = random(0, 255);
  const green = random(0, 255);
  const blue = random(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
}

function is_point_in_circle(point, circle) {
  const distanceSq =
    (point.x - circle.center.x) * (point.x - circle.center.x) +
    (point.y - circle.center.y) * (point.y - circle.center.y);
  const radiusSq = circle.radius * circle.radius;

  return distanceSq <= radiusSq;
}

function clamp(min, value, max) {
  return Math.max(min, Math.min(max, value));
}

function map(value, minFrom, maxFrom, minTo, maxTo) {
  return ((maxTo - minTo) * (value - minFrom)) / (maxFrom - minFrom);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

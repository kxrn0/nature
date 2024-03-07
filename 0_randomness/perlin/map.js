export default function map(value, minFrom, maxFrom, minTo, maxTo) {
  return ((maxTo - minTo) * (value - minFrom)) / (maxFrom - minFrom);
}

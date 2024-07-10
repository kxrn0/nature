function find_mean(values) {
  if (values.length === 0) return 0;

  const sum = values.reduce((tot, curr) => tot + curr, 0);

  return sum / values.length;
}

module.exports = find_mean;

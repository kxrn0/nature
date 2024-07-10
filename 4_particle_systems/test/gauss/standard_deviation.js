const find_mean = require("./mean");

function find_sd(values) {
  if (values.length === 0) return 0;

  const mean = find_mean(values);
  const sum = values.reduce((tot, curr) => tot + Math.pow(curr - mean, 2), 0);
  const sd = Math.sqrt(sum / values.length);

  return sd;
}

console.log(find_sd([46, 69, 32, 60, 52, 41]));

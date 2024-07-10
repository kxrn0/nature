function count_instances(array) {
  const hash = {};

  for (let i = 0; i < values.length - 1; i++) {
    const key = String(values[i]);

    if (!hash[key]) {
      hash[key] = 1;

      for (let j = i + 1; j < values.length; j++)
        if (values[i] === values[j]) hash[key]++;
    }
  }

  return hash;
}

function get_max_from_hash(hash) {
  let max = Number.NEGATIVE_INFINITY;

  for (let key in hash) if (hash[key] > max) max = hash[key];

  return max;
}

function find_mode(values) {
  const instances = count_instances(values);
  const max = get_max_from_hash(instances);
  const modes = [];

  for (let key in instances)
    if (instances[key] === max) modes.push(Number(key));

  return modes;
}

const values = [1, 2, 1, 2, 3, 4, 5, 3, 4, 6, 2, 7, 1];
const modes = find_mode(values);

console.log(modes);

function find_median(values) {
  if (values.length === 0) return 0;

  values = [...values].sort((a, b) => a - b);

  if (values.length % 2) {
    const midIndex = ~~(values.length / 2);

    return values[midIndex];
  } else {
    const nextIndex = values.length / 2;
    const prevIndex = nextIndex - 1;
    const next = values[nextIndex];
    const prev = values[prevIndex];
    const mean = (next + prev) / 2;

    return mean;
  }
}

const v1 = [350, 800, 220, 500, 130];
const v2 = [350, 800, 220, 500, 130, 1150];

console.log(find_median(v1));
console.log(find_median(v2));

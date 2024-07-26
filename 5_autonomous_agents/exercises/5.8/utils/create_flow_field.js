import create_value_map from "./create_value_map.js";
import get_average from "./get_average.js";

export default function create_flow_field(img, res, scale) {
  const values = create_value_map(img, res);
  const field = { vectors: [], cols: values.cols, rows: values.rows, scale };

  for (let y = 0; y < values.rows; y++)
    for (let x = 0; x < values.cols; x++) {
      const vector = get_average(x, y, values, res);

      field.vectors.push(vector);
    }

  return field;
}

function random_cut_convex(vertices) {
  const indexOne = ~~random(vertices.length);
  const indexOneNext = (indexOne + 1) % vertices.length;
  const start = get_random_point_in_seggs(
    vertices[indexOne],
    vertices[indexOneNext]
  );
  const cutOne = [start];

  const indexTwo = (indexOne + ~~(vertices.length / 2)) % vertices.length;
  const indexTwoNext = (indexTwo + 1) % vertices.length;
  const end = get_random_point_in_seggs(
    vertices[indexTwo],
    vertices[indexTwoNext]
  );
  const cutTwo = [end];

  let current = indexOneNext;

  while (current !== indexTwoNext) {
    cutOne.push(vertices[current].clone());

    current = (current + 1) % vertices.length;

    if (current === indexTwoNext) cutOne.push(end.clone());
  }

  current = indexTwoNext;

  while (current !== indexOneNext) {
    cutTwo.push(vertices[current].clone());

    current = (current + 1) % vertices.length;

    if (current === indexOneNext) cutTwo.push(start.clone());
  }

  return [cutOne, cutTwo];
}

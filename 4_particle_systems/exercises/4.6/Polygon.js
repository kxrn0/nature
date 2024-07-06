function Polygon(vertices, color, maxShards) {
  const centroid = Vector.from(find_centroid(vertices));

  this.vertices = vertices.map((vertex) => vertex.clone());
  this.color = color;
  this.maxShards = maxShards;
  this.shards = new ParticleSystem(centroid);
  this.state = Polygon.states.UNSHATTERED;
}

Polygon.states = {
  SHATTERED: "SHATTERED",
  UNSHATTERED: "UNSHATTERED",
};

Polygon.prototype.is_dead = is_dead = function () {
  return this.state === Polygon.states.SHATTERED && this.shards.is_empty();
};

Polygon.prototype.run = function (context, force) {
  if (this.state === Polygon.states.UNSHATTERED)
    fill_polygon(context, this.vertices, this.color);
  else this.shards.run(context, force);
};

Polygon.prototype.shatter = function (strength) {
  const maxIterations = 1000;
  let shards, iterations;

  shards = [this.vertices];
  iterations = 0;

  while (iterations++ < maxIterations && shards.length <= this.maxShards) {
    const tempShards = [];

    for (let vertexSet of shards) {
      const i0 = ~~random(0, vertexSet.length);
      const i1 = (i0 + 1) % vertexSet.length;
      const j0 = ~~(i0 + vertexSet.length / 2) % vertexSet.length;
      const j1 = (j0 + 1) % vertexSet.length;

      let a = get_random_point_in_seggs(vertexSet[i0], vertexSet[i1]);
      let b = get_random_point_in_seggs(vertexSet[j0], vertexSet[j1]);

      if (b.x < a.x) [a, b] = [b, a];

      const flat = vertexSet.flatMap((vertex) => [vertex.x, vertex.y]);
      const box = GetAABB(flat);
      const equation = get_linear_equation(a, b);

      a.x -= box.width;
      a.y = equation(a.x);
      b.x += box.width;
      b.y = equation(b.x);

      const line = { p1: a, p2: b };
      const slices = get_slices(vertexSet, line);

      tempShards.push(...slices);
    }

    shards = tempShards;
  }

  shards = shards.map((shard) => new Shard(shard, this.color));

  for (let shard of shards) {
    const force = Vector.random(strength);

    shard.apply_force(force);
  }

  this.shards.add_particles(shards);
  this.state = Polygon.states.SHATTERED;
};

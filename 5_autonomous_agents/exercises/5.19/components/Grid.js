export default function Grid(width, height, res, corner, boidParams) {
  this.width = width;
  this.height = height;
  this.res = res;
  this.corner = corner.clone();
  this.boundaries = {
    x: { min: corner.x, max: corner.x + width },
    y: { min: corner.y, max: corner.y + height },
  };
  this.cols = this.width / this.res;
  this.rows = this.height / this.res;
  this.cells = new Array(this.cols * this.rows);
  this.boids = [];
  this.obstacles = [];
  this.boidParams = boidParams;
}

Grid.prototype.run = function (context) {
  this.boids.forEach((boi) =>
    boi.run(context, this.boids, this.obstacles, this.boundaries)
  );
};

Grid.prototype.add_boid = function (boid) {
  this.boids.push(boid);
};

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = new Vector(0, 1);
const origin = new Vector(innerWidth / 2, innerHeight / 2);
const polygons = [];

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = polygons.length - 1; i >= 0; i--) {
    polygons[i].run(context, gravity);

    if (polygons[i].is_dead()) polygons.splice(i, 1);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const clicked = polygons.find((polygon) => {
      const vertices = polygon.vertices.flatMap((vertex) => [
        vertex.x,
        vertex.y,
      ]);

      return ContainsPoint(vertices, event.offsetX, event.offsetY);
    });

    if (clicked) {
      clicked.shatter(10);
    } else {
      const vertices = create_polygon(
        new Vector(event.offsetX, event.offsetY),
        5,
        10,
        50,
        100
      ).map((vertex) => Vector.from(vertex));
      const color = random_rgb();
      const maxShards = 10;
      const polygon = new Polygon(vertices, color, maxShards);

      polygons.push(polygon);
    }
  });

  requestAnimationFrame(anime);
}

init();

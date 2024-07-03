const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const dist = 10;
const vertices = [
  { x: 300, y: 100 },
  { x: 600, y: 200 },
  { x: 400, y: 200 },
  { x: 500, y: 300 },
  { x: 400, y: 400 },
  { x: 300, y: 300 },
  { x: 200, y: 400 },
  { x: 100, y: 300 },
  { x: 200, y: 200 },
];
const line = {
  p1: { x: 100, y: 100 },
  p2: { x: 500, y: 50 },
};
let shards = [];
let dragged = null;

function fun() {
  const shards = get_shards(vertices, line);

  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let shard of shards) fill_polygon(context, shard, random_rgb());

  stroke_vertices(context, vertices, dist);
  draw_line(context, line, dist);
}

canvas.width = innerWidth;
canvas.height = innerHeight;

canvas.addEventListener("mousedown", (event) => {
  const circle = {
    center: { x: event.clientX, y: event.clientY },
    radius: dist,
  };

  if (is_point_in_circle(line.p1, circle)) {
    dragged = line.p1;
  } else if (is_point_in_circle(line.p2, circle)) {
    dragged = line.p2;
  } else {
    const vertex = vertices.find((verty) => is_point_in_circle(verty, circle));

    dragged = vertex;
  }
});

canvas.addEventListener("mouseup", () => (dragged = null));

canvas.addEventListener("mousemove", (event) => {
  if (!dragged) return;

  dragged.x = event.clientX;
  dragged.y = event.clientY;

  fun();
});

fun();

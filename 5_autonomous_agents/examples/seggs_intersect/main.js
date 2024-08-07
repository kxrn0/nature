import Vector from "./components/Vector.js";
import create_polygon from "./utils/create_polygon.js";
import draw_circle from "./utils/draw_circle.js";
import draw_line from "./utils/draw_line.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";
import segments_intersect from "./utils/segments_intersect.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const lines = [];
let line, offset, moved;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let line of lines) {
    draw_line(
      context,
      line.start,
      line.end,
      line.isIntersecting ? "red" : "orange",
      3
    );
  }

  draw_line(context, line.start, line.end, line.color, 3);
  draw_circle(context, line.start, line.radius, line.color);
  draw_circle(context, line.end, line.radius, line.color);

  requestAnimationFrame(anime);
}

function init() {
  const center = new Vector(innerWidth / 2, innerHeight / 2);
  const hex = create_polygon(center, 450, 7, Math.PI / 2);
  const sq = create_polygon(center, 300, 4, Math.PI / 4);

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  line = {
    start: new Vector(innerWidth / 2 - 100, innerHeight / 2),
    end: new Vector(innerWidth / 2 + 100, innerHeight / 2),
    radius: 10,
    color: "blue",
  };

  offset = new Vector(0, 0);

  for (let i = 0; i < hex.length - 1; i++)
    lines.push({ start: hex[i], end: hex[i + 1], isIntersecting: false });

  lines.push({ start: hex.at(-1), end: hex[0], isIntersecting: false });

  for (let i = 0; i < sq.length - 1; i++)
    lines.push({ start: sq[i], end: sq[i + 1], isIntersecting: false });

  lines.push({ start: sq.at(-1), end: sq[0], isIntersecting: false });

  canvas.addEventListener("mousedown", (event) => {
    const point = new Vector(event.offsetX, event.offsetY);
    const c1 = { center: line.start, radius: line.radius };
    const c2 = { center: line.end, radius: line.radius };
    const cs = [c1, c2];

    moved = cs.find((c) => is_point_in_circle(c, point))?.center;

    if (!moved) return;

    const x = moved.x - point.x;
    const y = moved.y - point.y;

    offset.set(x, y);
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!moved) return;

    moved.set(event.offsetX, event.offsetY).add(offset);

    for (let segment of lines)
      segment.isIntersecting = segments_intersect(segment, line);
  });

  canvas.addEventListener("mouseup", () => (moved = null));

  requestAnimationFrame(anime);
}

init();

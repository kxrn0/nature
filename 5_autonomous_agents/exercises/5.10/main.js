import get_line from "./utils/get_line.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";
import draw_segment from "./utils/draw_segment.js";
import draw_circle from "./utils/draw_circle.js";
import is_between from "./utils/is_between.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const segment = { start: null, end: null };
const point = { x: null, y: null };
const radius = 10;
const offset = { x: 0, y: 0 };
let isBetween, moving, line, isMovingPoint;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const color = isBetween ? "greenyellow" : "red";

  draw_segment(context, segment);
  draw_circle(context, segment.start, radius, "black");
  draw_circle(context, segment.end, radius, "black");

  draw_circle(context, point, radius, color);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  segment.start = { x: innerWidth / 3, y: innerHeight / 2 };
  segment.end = { x: (2 * innerWidth) / 3, y: innerHeight / 2 };
  point.x = innerWidth / 2;
  point.y = innerHeight / 2;
  isBetween = true;
  moving = null;
  isMovingPoint = false;
  line = () => innerHeight / 2;

  canvas.addEventListener("mousedown", (event) => {
    const current = { x: event.offsetX, y: event.offsetY };
    const c1 = { center: segment.start, radius };
    const c2 = { center: segment.end, radius };
    const c3 = { center: point, radius };
    const cs = [c1, c2, c3];
    const target = cs.find((c) => is_point_in_circle(current, c));

    if (!target) return;

    moving = target.center;

    isMovingPoint = moving === point;

    offset.x = moving.x - current.x;
    offset.y = moving.y - current.y;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!moving) return;

    moving.x = event.offsetX + offset.x;

    if (isMovingPoint) {
      moving.y = line(moving.x);
    } else {
      moving.y = event.offsetY + offset.y;

      line = get_line(segment.start, segment.end);

      point.y = line(point.x);
    }

    isBetween = is_between(point, segment.start, segment.end);
  });

  canvas.addEventListener("mouseup", () => {
    moving = null;
    isMovingPoint = false;
  });

  canvas.addEventListener("mouseout", () => {
    moving = null;
    isMovingPoint = false;
  });

  requestAnimationFrame(anime);
}

init();

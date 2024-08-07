import Vector from "./components/Vector.js";
import are_intersecting from "./utils/are_intersecting.js";
import dist from "./utils/dist.js";
import draw_circle from "./utils/draw_circle.js";
import draw_line from "./utils/draw_line.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const MODES = {
  CREATE_PATH: "CREATE_PATH",
  MOVE_POINT: "MOVE_POINT",
  SELECT_PATH: "SELECT_PATH",
  ADD_VEHICLE: "ADD_VEHICLE",
};
const RADIUS = 10;
const MIN_SIZE = 10;
let mode, tempSeggs, segg;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (tempSeggs) {
    for (let i = 0; i < tempSeggs.length - 1; i++)
      draw_line(context, tempSeggs[i], tempSeggs[i + 1], "blue", 5);

    draw_circle(
      context,
      tempSeggs[0],
      RADIUS,
      segg?.closingIn ? "greenyellow" : "transparent",
      "black",
      1
    );
    draw_circle(context, tempSeggs.at(-1), RADIUS, "blue", "transparent", 1);
  }

  if (segg)
    draw_line(
      context,
      segg.start,
      segg.end,
      segg.isIntersecting ? "red" : "green",
      5
    );

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  mode = MODES.CREATE_PATH;

  canvas.addEventListener("mousedown", (event) => {
    if (mode === MODES.CREATE_PATH) {
      if (tempSeggs) {
        const start = tempSeggs.at(-1).clone();
        const radius = RADIUS;
        const point = new Vector(event.offsetX, event.offsetY);
        const circle = { center: start, radius };

        if (is_point_in_circle(point, circle)) {
          segg = {
            start,
            end: start.clone(),
            isIntersecting: false,
            closingIn: false,
          };
        }
      } else {
        const start = new Vector(event.offsetX, event.offsetY);
        const end = start.clone();

        segg = { start, end, isIntersecting: false, closingIn: false };
      }
    } else if (mode === MODES.MOVE_POINT) {
    } else if (mode === MODES.SELECT_PATH) {
    } else if (mode === MODES.ADD_VEHICLE) {
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (mode === MODES.CREATE_PATH) {
      if (segg) {
        segg.end.set(event.offsetX, event.offsetY);

        if (tempSeggs) {
          const v = Vector.from_segment(segg.start, segg.end).set_size(
            MIN_SIZE
          );
          const start = segg.start.clone().add(v);
          const current = { start, end: segg.end };

          for (let i = 0; i < tempSeggs.length - 1; i++) {
            const other = { start: tempSeggs[i], end: tempSeggs[i + 1] };

            segg.isIntersecting = are_intersecting(other, current);

            if (segg.isIntersecting) break;
          }

          const circle = { center: tempSeggs[0], radius: RADIUS };

          segg.closingIn = is_point_in_circle(segg.end, circle);
        }
      }
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    if (mode === MODES.CREATE_PATH) {
      if (segg) {
        const size = dist(segg.start, segg.end);

        if (!segg.isIntersecting && size >= MIN_SIZE) {
          if (tempSeggs) {
            tempSeggs.push(segg.end);

            if (segg.closingIn) {
              //create a new path, and change the mode to add vehicle
            }
          } else tempSeggs = [segg.start, segg.end];
        }

        segg = null;
      }
    }
  });

  requestAnimationFrame(anime);
}

init();

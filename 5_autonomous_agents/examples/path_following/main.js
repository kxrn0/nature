import Path from "./components/Path.js";
import PathManager from "./components/PathManager.js";
import Vector from "./components/Vector.js";
import Vehicle from "./components/Vehicle.js";
import are_intersecting from "./utils/are_intersecting.js";
import dist from "./utils/dist.js";
import draw_circle from "./utils/draw_circle.js";
import draw_line from "./utils/draw_line.js";
import find_corners from "./utils/find_corners.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";
import is_point_in_rect from "./utils/is_point_in_rect.js";
import seg_point_dist from "./utils/seg_point_dist.js";

const MODES = {
  CREATE_PATH: "CREATE_PATH",
  MOVE_POINT: "MOVE_POINT",
  SELECT_PATH: "SELECT_PATH",
  ADD_VEHICLE: "ADD_VEHICLE",
};
const RADIUS = 10;
const PATH_RADIUS = 25;
const MIN_SIZE = 10;
const addPathRadio = document.querySelector("#add-path-radio");
const moveRadio = document.querySelector("#move-radio");
const selectRadio = document.querySelector("#select-radio");
const addVehicleRadio = document.querySelector("#add-vehicle-radio");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const managers = [];
const moveOffset = new Vector(0, 0);
let mode, tempSeggs, segg, movedPoint, selectedManager;

function create_path() {
  if (!tempSeggs) return;

  selectedManager?.path.deselect();

  const path = new Path(tempSeggs, PATH_RADIUS);

  selectedManager = new PathManager(path);

  managers.push(selectedManager);

  addVehicleRadio.removeAttribute("disabled");
  addVehicleRadio.parentElement.classList.remove("disabled");

  tempSeggs = null;
  segg = null;
}

function select() {
  if (selectedManager) selectedManager.path.drawMode = Path.DRAW_MODES.SELECTED;
}

function deselect() {
  selectedManager?.path.deselect();
  selectedManager = null;
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let manager of managers) manager.run(context);

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
  selectedManager = null;
  movedPoint = null;

  addPathRadio.addEventListener("change", () => {
    deselect();

    mode = MODES.CREATE_PATH;
  });

  moveRadio.addEventListener("change", () => {
    create_path();

    if (selectedManager) selectedManager.path.drawMode = Path.DRAW_MODES.MOVING;

    mode = MODES.MOVE_POINT;
  });

  selectRadio.addEventListener("change", () => {
    create_path();
    select();

    mode = MODES.SELECT_PATH;
  });

  addVehicleRadio.addEventListener("change", () => {
    create_path();
    select();

    mode = MODES.ADD_VEHICLE;
  });

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
      if (!selectedManager) return;

      const mouse = new Vector(event.offsetX, event.offsetY);

      movedPoint = selectedManager.path.points.find((point) => {
        const circle = { center: point, radius: Path.POINT_RADIUS };
        const isSelected = is_point_in_circle(mouse, circle);

        return isSelected;
      });

      if (movedPoint)
        moveOffset.set(movedPoint.x - mouse.x, movedPoint.y - mouse.y);
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

          if (segg.closingIn) {
            const first = { start: tempSeggs[0], end: tempSeggs[1] };

            if (are_intersecting(first, current)) segg.isIntersecting = false;
          }
        }
      }
    } else if (mode === MODES.MOVE_POINT) {
      movedPoint?.set(
        event.offsetX + moveOffset.x,
        event.offsetY + moveOffset.y
      );
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
              tempSeggs[tempSeggs.length - 1] = tempSeggs[0];

              create_path();

              mode = MODES.ADD_VEHICLE;

              addVehicleRadio.checked = true;
            }
          } else tempSeggs = [segg.start, segg.end];
        }

        segg = null;
      }
    } else if (mode === MODES.MOVE_POINT) {
      movedPoint = null;
    } else if (mode === MODES.SELECT_PATH) {
      const mouse = new Vector(event.offsetX, event.offsetY);

      const clickedManager = managers.reduce(
        (closest, manager) => {
          const path = manager.path;
          let minDist = Number.POSITIVE_INFINITY;

          for (let i = 0; i < path.points.length - 1; i++) {
            const line = { start: path.points[i], end: path.points[i + 1] };
            const corners = find_corners(line, path.radius * 2);
            const isIn = is_point_in_rect(corners, mouse);

            if (!isIn) continue;

            const distance = seg_point_dist(line, mouse);

            if (distance < minDist) minDist = distance;
          }

          if (minDist < closest.distance)
            closest = { distance: minDist, manager };

          return closest;
        },
        {
          distance: Number.POSITIVE_INFINITY,
          manager: null,
        }
      )?.manager;

      if (clickedManager) {
        deselect();
        selectedManager = clickedManager;
        select();
      }
    } else if (mode === MODES.ADD_VEHICLE) {
      if (!selectedManager) return;

      const position = new Vector(event.offsetX, event.offsetY);
      const width = 20;
      const height = 10;
      const mass = 30;
      const maxSpeed = 5;
      const maxForce = 10;
      const color = "purple";
      const vehicle = new Vehicle(
        position,
        width,
        height,
        mass,
        maxSpeed,
        maxForce,
        color
      );
      const push = Vector.random(10);

      vehicle.apply_force(push);

      selectedManager.add_vehicle(vehicle);
    }
  });

  requestAnimationFrame(anime);
}

init();

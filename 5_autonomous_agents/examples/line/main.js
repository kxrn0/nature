const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const MODES = { POINT: "point", LINE: "line", SELECT: "select" };
const lines = [];
let start, end, mode, isDragging, selected;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (mode === MODES.LINE && isDragging)
    draw_line(context, start, end, "orange", 2);

  for (let line of lines) line.draw(context);

  requestAnimationFrame(anime);
}

function init_controls() {
  const pointRadio = document.querySelector("#point-radio");
  const lineRadio = document.querySelector("#line-radio");
  const selectRadio = document.querySelector("#select-radio");

  pointRadio.addEventListener("change", () => {
    mode = MODES.POINT;
    isDragging = false;
  });

  lineRadio.addEventListener("change", () => {
    mode = MODES.LINE;

    if (selected) {
      selected.isSelected = false;
      selected = null;
    }
  });

  selectRadio.addEventListener("change", () => {
    mode = MODES.SELECT;
    isDragging = false;
  });

  canvas.addEventListener("mousedown", (event) => {
    if (mode === MODES.LINE) {
      isDragging = true;
      start.x = event.offsetX;
      start.y = event.offsetY;
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (mode === MODES.LINE) {
      end.x = event.offsetX;
      end.y = event.offsetY;
    }
  });

  canvas.addEventListener("mouseup", (event) => {
    if (mode === MODES.LINE) {
      const line = new Line(start, end);

      lines.push(line);

      start = { x: 0, y: 0 };
      end = { x: 0, y: 0 };
      isDragging = false;
    } else if (mode === MODES.POINT) {
      if (!selected) return;

      const coords = { x: event.offsetX, y: event.offsetY };
      const corners = find_corners(selected, selected.influence);
      const isIn = is_point_in_rect(corners, coords);
      let closest;

      if (!isIn) return;

      const n = selected.end.y - selected.start.y;
      const d = selected.end.x - selected.start.x;

      if (n === 0) closest = { x: coords.x, y: selected.start.y };
      else if (d === 0) closest = { x: selected.start.x, y: coords.y };
      else {
        const m0 = n / d;
        const a = m0;
        const b = -1;
        const c = selected.start.y - selected.start.x * m0;
        const params = { a, b, c };

        closest = find_closest(coords, params);
      }

      selected.points.push({ coords, closest });
    } else if (mode === MODES.SELECT) {
      const point = { x: event.offsetX, y: event.offsetY };
      const nextSelected = lines.reduce(
        (closest, line) => {
          const corners = find_corners(line, line.height);
          const isIn = is_point_in_rect(corners, point);

          if (!isIn) return closest;

          const distance = seg_point_dist(line, point);

          if (distance <= line.height / 2 && distance < closest.distance)
            closest = { distance, line };

          return closest;
        },
        {
          distance: Number.POSITIVE_INFINITY,
          line: null,
        }
      );

      if (nextSelected.line) {
        if (selected) selected.isSelected = false;

        selected = nextSelected.line;
        selected.isSelected = true;
      }
    }
  });
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  start = { x: 0, y: 0 };
  end = { x: 0, y: 0 };
  mode = MODES.LINE;
  isDragging = false;
  selected = null;

  const a = new Line({ x: 200, y: 200 }, { x: 400, y: 200 });
  const b = new Line({ x: 500, y: 600 }, { x: 500, y: 200 });

  lines.push(a, b);

  init_controls();

  requestAnimationFrame(anime);
}

init();

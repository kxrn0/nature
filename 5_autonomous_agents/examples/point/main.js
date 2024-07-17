const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const wall = new Wall({ x: 200, y: 200 }, { x: 400, y: 200 }, 50);
const point = { x: innerWidth / 2, y: innerHeight / 2 };
let isDragging = false;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  wall.draw(context);

  draw_point(context, point, "black");

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("mousedown", (event) => {
    const contact = { x: event.offsetX, y: event.offsetY };
    const circle = { position: point, radius: 10 };

    if (is_point_in_circle(circle, contact)) isDragging = true;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (isDragging) {
      point.x = event.offsetX;
      point.y = event.offsetY;

      const corners = find_corners(wall, wall.height);
      const isInRect = is_point_in_rect(corners, point);

      if (isInRect) wall.isOn = true;
      else wall.isOn = false;
    }
  });

  canvas.addEventListener("mouseup", () => (isDragging = false));

  window.addEventListener("keypress", (event) => {
    console.log(event.key);
  });

  requestAnimationFrame(anime);
}

init();

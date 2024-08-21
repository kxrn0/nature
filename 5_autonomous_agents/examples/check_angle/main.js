const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const center = {
  x: null,
  y: null,
};
const ball = {
  x: null,
  y: null,
  radius: 10,
};
const offset = {
  x: 0,
  y: 0,
  active: false,
};
const radius = 100;

function is_point_in_circle(point, circle) {
  const d2 =
    (point.x - circle.x) * (point.x - circle.x) +
    (point.y - circle.y) * (point.y - circle.y);
  const r2 = circle.radius * circle.radius;

  return d2 <= r2;
}

function draw() {
  context.beginPath();
  context.fillStyle = "blue";
  context.strokeStyle = "blue";
  context.moveTo(center.x, center.y);
  context.lineTo(ball.x, ball.y);
  context.stroke();
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fill();
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  draw();

  requestAnimationFrame(anime);
}

function init() {
  const p = document.querySelector("p");

  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
  ball.x = center.x + radius;
  ball.y = center.y;

  canvas.addEventListener("mousedown", (event) => {
    const point = {
      x: event.offsetX,
      y: event.offsetY,
    };

    if (is_point_in_circle(point, ball)) {
      offset.x = ball.x - point.x;
      offset.y = ball.y - point.y;
      offset.active = true;
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!offset.active) return;

    const x0 = event.offsetX + offset.x - center.x;
    const y0 = event.offsetY + offset.y - center.y;
    const angle = Math.atan2(y0, x0);
    const x = radius * Math.cos(angle) + center.x;
    const y = radius * Math.sin(angle) + center.y;
    const degrees = (angle * 180) / Math.PI;
    const value = (degrees < 0 ? 360 + degrees : degrees).toFixed(2);

    p.innerText = `degrees: ${value}`;

    ball.x = x;
    ball.y = y;
  });

  canvas.addEventListener("mouseup", () => (offset.active = false));

  requestAnimationFrame(anime);
}

init();

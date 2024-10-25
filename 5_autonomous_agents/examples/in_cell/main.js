import Ball from "./components/Ball.js";
import Grid from "./components/Grid.js";
import are_circles_intersecting from "./utils/are_circles_intersecting.js";
import is_point_in_circle from "./utils/is_point_in_circle.js";
import dist from "./utils/dist.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const balls = [];
let grid, isDragging;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  grid.draw(context);

  for (let ball of balls) ball.draw(context);

  requestAnimationFrame(anime);
}

function init_controls() {
  canvas.addEventListener("mousedown", (event) => {
    const point = { x: event.offsetX, y: event.offsetY };
    let baal;

    for (let i = balls.length - 1; i >= 0; i--) {
      const ball = balls[i];
      
      if (is_point_in_circle(ball, point)) {
        baal = ball;
        break;
      }
    }

    
  });

  canvas.addEventListener("mouseup", (event) => {});

  // canvas.addEventListener("click", (event) => {
  //   const position = { x: event.offsetX, y: event.offsetY };
  //   const radius = 25;
  //   const ball = new Ball(position, radius, "");
  //   // const other = balls.find((other) => are_circles_intersecting(other, ball));

  //   balls.push(ball);

  //   //   const point = { x: event.offsetX, y: event.offsetY };

  //   //   const radius = 25;
  //   //   const ball = new Ball(point, radius, "");
  //   //   const other = balls.find((other) => are_circles_intersecting(other, ball));

  //   //   if (other) {
  //   //     const distance = dist(other.position, ball.position);
  //   //     const radialSum = other.radius + ball.radius;
  //   //     const overlap = radialSum - distance;
  //   //     const vector = {
  //   //       x: (overlap * (ball.position.x - other.position.x)) / distance,
  //   //       y: (overlap * (ball.position.y - other.position.y)) / distance,
  //   //     };

  //   //     ball.position.x += vector.x;
  //   //     ball.position.y += vector.y;
  //   //   }

  //   //   balls.push(ball);
  // });
}

function init() {
  const width = innerWidth / 2;
  const height = innerHeight / 2;
  const center = { x: width, y: height };
  const corner = { x: center.x - width / 2, y: center.y - height / 2 };
  const res = 100;

  grid = new Grid(corner, width, height, res);

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  isDragging = false;

  init_controls();

  requestAnimationFrame(anime);
}

init();

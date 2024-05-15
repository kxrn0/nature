import Body from "./Body";
import Player from "./Player";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const STATES = { PAUSED: "paused", RUNNING: "running" };
const mouse = new Vector(0, 0);
const bodies = [];
const balls = [];
const gravity = new Vector(0, 1);
let frameId, player;

function draw_floor() {
  context.beginPath();
  context.fillStyle = "brown";
  context.fillRect(0, canvas.height - 120, canvas.width, 120);
  context.fillStyle = "green";
  context.fillRect(0, canvas.height - 120, canvas.width, 20);
}

function anime() {
  context.beginPath();
  context.fillStyle = "skyblue";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let body of bodies) {
    body.move();
    body.draw(context);
  }

  draw_floor();

  for (let ball of balls) {
    ball.apply_force(gravity);
    ball.move();
    ball.draw(context);
  }

  player.draw(context);

  frameId = requestAnimationFrame(anime);
}

function init() {
  // canvas.addEventListener("click", () => {
  //   if (!frameId) frameId = requestAnimationFrame(anime);
  //   else {
  //     cancelAnimationFrame(frameId);
  //     frameId = null;
  //     document.addEventListener("keydown", (event) => {
  //       if (event.key === "ArrowUp") {
  //         this.barrelBox.angle = Math.min(
  //           Math.PI / 2,
  //           this.barrelBox.angle + 0.1
  //         );
  //       } else if (event.key === "ArrowDown") {
  //         this.barrelBox.angle = Math.max(0, this.barrelBox.angle - 0.1);
  //       }
  //     });
  //     //draw pause screen
  //   }
  // });

  const boundaries = {
    x: { min: -Infinity, max: Infinity },
    y: { min: -Infinity, max: innerHeight - 120 },
  };

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  player = new Player(new Vector(100, innerHeight - 120));

  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      const ball = player.shoot(boundaries);

      if (!ball) return;

      balls.push(ball);
    }
  });

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        player.rotate(-0.05);
        break;
      case "ArrowDown":
        player.rotate(0.05);
        break;
    }
  });

  document.addEventListener("mousemove", (event) =>
    mouse.set(event.clientX, event.clientY)
  );

  requestAnimationFrame(anime);
}

init();

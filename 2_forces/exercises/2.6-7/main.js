import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const radioBall = document.querySelector("#radioBall");
const radioFric = document.querySelector("#radioFric");
const radioPull = document.querySelector("#radioPull");
const range = document.querySelector("#range");
const STATES = {
  ADDING_BALLS: "adding_balls",
  ADDING_FRICS: "adding_frics",
  DRAGGING_BALLS: "dragging_balls",
};
const balls = [];
const frics = [];
let prevTime, state, size, mouse;

function draw_marker() {
  if (state === STATES.DRAGGING_BALLS) return;

  context.beginPath();
  context.strokeStyle = "black";
  context.arc(mouse.x, mouse.y, size, 0, Math.PI * 2);
  context.stroke();
}

function anime(timestamp) {
  const dt = (timestamp - prevTime) / 1000;

  context.clearRect(0, 0, canvas.width, canvas.height);

  draw_marker();

  prevTime = timestamp;

  requestAnimationFrame(anime);
}

function init() {
  prevTime = 0;
  state = STATES.ADDING_BALLS;
  size = 25;
  mouse = { x: 0, y: 0 };

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener("click", () => {
    if (state === STATES.ADDING_BALLS) {
      console.log("balls");
    }
  });

  radioBall.addEventListener("change", () => {
    if (radioBall.checked) {
      state = STATES.ADDING_BALLS;

      range.setAttribute("min", "1");
      range.setAttribute("max", "50");

      size = 25;
    }
  });

  radioFric.addEventListener("change", () => {
    if (radioFric.checked) {
      state = STATES.ADDING_FRICS;

      range.setAttribute("min", "25");
      range.setAttribute("max", "100");

      size = 50;
    }
  });

  radioPull.addEventListener("change", () => {
    if (radioPull.checked) state = STATES.DRAGGING_BALLS;
  });

  range.addEventListener("input", () => (size = Number(range.value)));

  window.addEventListener(
    "mousemove",
    (e) => (mouse = { x: e.clientX, y: e.clientY })
  );

  requestAnimationFrame(anime);
}

init();

import create_blur from "./utils/create_blur";
import draw_blur from "./utils/draw_blur";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const controls = document.querySelector(".controls");
const input = controls.querySelector("input");
const text = controls.querySelector("span");
const img = document.querySelector("img");
const center = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};
const width = 650;
let res;

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const blur = create_blur(img, res);
  const scale = width / blur.cols;
  draw_blur(context, center, blur, scale);
}

function init() {
  res = 50;

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  input.addEventListener("change", () => {
    res = Number(input.value);

    text.innerText = `resolution: ${res}`;

    draw();
  });

  draw();
}

init();

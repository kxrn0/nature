import Vector from "./components/Vector.js";
import create_flow_field from "./utils/create_flow_field.js";
import draw_field from "./utils/draw_field.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const img = document.querySelector("img");

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const res = 5;
  const scale = 5;
  const field = create_flow_field(img, res, scale);
  const center = new Vector(innerWidth / 2, innerHeight / 2);

  draw_field(context, center, field);
}

init();

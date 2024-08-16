import Vector from "./components/Vector.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const observer = {
  position: new Vector(innerWidth / 2, innerHeight / 2),
  angle: 0,
  width: 30,
  height: 20,
  vision: {
    angle: Math.PI / 2,
    radius: 100,
  },
};

function anime() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  requestAnimationFrame(anime);
}

init();

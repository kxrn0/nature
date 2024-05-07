import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function anime() {
  requestAnimationFrame(anime);
}

function init() {
  requestAnimationFrame(anime);
}

init();

import Mexp from "math-expression-evaluator";
import Walker from "./entities/Walker";
import get_rnd from "./utilities/get_rnd";
import "./style.css";

const addButton = document.getElementById("add-walker");
const resetButton = document.getElementById("reset-canvas");
const funInput = document.getElementById("fun");
const minInput = document.getElementById("min");
const maxInput = document.getElementById("max");
const condInput = document.getElementById("cond");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const mexp = new Mexp();
let prevTime, min, max, fun, cond, walkers;

function anime(timestamp) {
  const dt = (timestamp - prevTime) / 1000;

  prevTime = timestamp;

  for (let walker of walkers)
    walker.update(dt, () => get_rnd(min, max, fun, cond));

  requestAnimationFrame(anime);
}

function init() {
  prevTime = performance.now();
  min = -50;
  max = 50;
  fun = (x) => 50 * Math.pow(Math.E, (-x * x) / 500);
  cond = (a, b) => a < b;
  walkers = [];

  requestAnimationFrame(anime);
}

funInput.addEventListener("change", () => {
  const exp = funInput.value;

  fun = (x) => mexp.eval(exp.replace(/x/g, x));
});

addButton.addEventListener("click", () => walkers.push(new Walker(canvas)));

resetButton.addEventListener("click", () => {
  walkers = [];

  context.clearRect(0, 0, canvas.width, canvas.height);
});

minInput.addEventListener("change", () => (min = Number(minInput.value)));

maxInput.addEventListener("change", () => (max = Number(maxInput.value)));

condInput.addEventListener("change", () => {
  const value = condInput.value;

  if (value === "<") cond = (a, b) => a < b;
  else if (value === ">") cond = (a, b) => a > b;
});

init();

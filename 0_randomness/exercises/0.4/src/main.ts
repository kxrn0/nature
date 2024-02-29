import "./style.css";

const canvas = document.querySelector("canvas")!;
const context = canvas.getContext("2d")!;
const button = document.querySelector("button")!;
const range = document.querySelector("input") as HTMLInputElement;
const red = document.getElementById("red") as HTMLInputElement;
const green = document.getElementById("green") as HTMLInputElement;
const blue = document.getElementById("blue") as HTMLInputElement;
const color = document.getElementById("color") as HTMLInputElement;

function random_gaussian(mean: number, sd: number) {
  let u, v;

  u = 0;
  v = 0;

  while (!u) u = Math.random(); // Converting [0,1) to (0,1)
  while (!v) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  return mean + z * sd;
}

function clamp(min: number, val: number, max: number) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

canvas.addEventListener("click", (event) => {
  const box = canvas.getBoundingClientRect();
  const xM = event.clientX - box.x;
  const yM = event.clientY - box.y;
  const sd = Number(range.value);

  for (let i = 0; i < 10000; i++) {
    const x = random_gaussian(xM, sd);
    const y = random_gaussian(yM, sd);
    const cd = Number(color.value);
    const r = ~~clamp(0, random_gaussian(Number(red.value), cd), 255);
    const g = ~~clamp(0, random_gaussian(Number(green.value), cd), 255);
    const b = ~~clamp(0, random_gaussian(Number(blue.value), cd), 255);
    const style = `rgb(${r}, ${g}, ${b})`;

    context.fillStyle = style;
    context.beginPath();
    context.arc(x, y, 1, 0, Math.PI * 2);
    context.fill();
  }
});

button.addEventListener("click", () =>
  context.clearRect(0, 0, canvas.width, canvas.height)
);

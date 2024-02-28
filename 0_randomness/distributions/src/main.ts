const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const button = document.querySelector("button")!;
const meanInput = document.getElementById("mean-input") as HTMLInputElement;
const sdInput = document.getElementById("sd-input") as HTMLInputElement;

function map(
  value: number,
  fromStart: number,
  toStart: number,
  fromEnd: number,
  toEnd: number
) {
  return ((toEnd - fromEnd) * (value - fromStart)) / (toStart - fromStart);
}

function g(x: number, m: number, sd: number) {
  return (
    (1 / (sd * Math.sqrt(2 * Math.PI))) *
    Math.pow(Math.E, -0.5 * Math.pow((x - m) / sd, 2))
  );
}

button.addEventListener("click", () => {
  const mean = Number(meanInput.value);
  const sd = Number(sdInput.value);

  if (!mean || !sd) return;

  const values = [];
  let highest;

  highest = 0;
  for (let x = 0; x < canvas.width; x++) {
    const p = g(x, mean, sd);

    if (p < 0.0001) continue;

    if (p > highest) highest = p;

    values.push({ x, p });
  }

  context.fillStyle = "#12fe89";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "red";
  context.beginPath();
  context.moveTo(
    values[0].x,
    canvas.height - map(values[0].p, 0, highest, 0, canvas.height)
  );
  for (let x = 1; x < values.length; x++) {
    context.lineTo(
      values[x].x,
      canvas.height - map(values[x].p, 0, highest, 0, canvas.height)
    );
    context.stroke();
  }
});

meanInput.addEventListener("change", () => {
  const value = Number(meanInput.value);

  if (value < 0) meanInput.value = "0";

  if (value > canvas.width) meanInput.value = `${canvas.width}`;
});

sdInput.addEventListener("change", () => {
  const value = Number(sdInput.value);
  const mean = Number(meanInput.value);

  if (value < 0) sdInput.value = "0";

  if (value > mean) sdInput.value = `${mean}`;
});

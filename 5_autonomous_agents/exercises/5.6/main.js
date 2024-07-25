import { createNoise2D } from "simplex-noise";
import Grid from "./components/Grid";
import Vector from "./components/Vector";
import map from "./utils/map";
import "./style.css";

const resolution = 20;

let a1 = 0;
const c1 = document.querySelector("#c-1");
const c1c = c1.getContext("2d");
const g1 = new Grid(resolution, c1.width, c1.height, set_first);

const c2 = document.querySelector("#c-2");
const c2c = c2.getContext("2d");
const g2 = new Grid(resolution, c2.width, c2.height, set_random);

const c3 = document.querySelector("#c-3");
const c3c = c3.getContext("2d");
const sc = new Vector(c3.width / 2, c3.height / 2);
const g3 = new Grid(resolution, c3.width, c3.height, set_swirl);

let dt = 0.05;
const c4 = document.querySelector("#c-4");
const c4c = c4.getContext("2d");
const g4 = new Grid(resolution, c4.width, c4.height, set_perlin);

const c5 = document.querySelector("#c-5");
const c5c = c5.getContext("2d");
const oc = new Vector(c5.width / 2, c5.height / 2);
const g5 = new Grid(resolution, c5.width, c5.height, set_radial);

function set_first(vectors, resolution, cols, rows) {
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
      const vector = Vector.from_angle(a1, resolution);

      vectors[x][y] = vector;
    }
}

function set_random(vectors, resolution, cols, rows) {
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
      vectors[x][y] = Vector.random(resolution);
    }
}

function set_swirl(vectors, resolution, cols, rows) {
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
      const vector = new Vector(y - sc.y / resolution, -x + sc.x / resolution);

      vectors[x][y] = vector;
    }
}

function set_perlin(vectors, resolution, cols, rows) {
  const noise = createNoise2D();
  let xOff;

  xOff = 0;

  for (let x = 0; x < cols; x++) {
    let yOff;

    yOff = 0;

    for (let y = 0; y < rows; y++) {
      const value = noise(xOff, yOff);
      const angle = map(value, -1, 1, 0, Math.PI * 2);
      const vector = Vector.from_angle(angle, resolution);

      vectors[x][y] = vector;
      yOff += dt;
    }
    xOff += dt;
  }
}

function set_radial(vectors, resolution, cols, rows) {
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
      const angle = Math.atan2(y - oc.y / resolution, x - oc.x / resolution);
      const vector = Vector.from_angle(angle, resolution);

      vectors[x][y] = vector;
    }
}

c1.addEventListener("mousemove", (event) => {
  const x = event.offsetX - c1.width / 2;
  const y = event.offsetY - c1.height / 2;
  const angle = Math.atan2(y, x);

  a1 = angle;

  g1.apply_function(set_first);
  c1c.clearRect(0, 0, c1.width, c1.height);
  g1.draw(c1c);
});

c2.addEventListener("click", () => {
  g2.apply_function(set_random);
  c2c.clearRect(0, 0, c2.width, c2.height);
  g2.draw(c2c);
});

c3.addEventListener("mousemove", (event) => {
  sc.set(event.offsetX, event.offsetY);
  g3.apply_function(set_swirl);
  c3c.clearRect(0, 0, c3.width, c3.height);
  g3.draw(c3c);
});

c4.addEventListener("mousemove", (event) => {
  dt = map(event.offsetX, 0, c4.width, 0.01, 0.1);

  g4.apply_function(set_perlin);
  c4c.clearRect(0, 0, c4.width, c4.height);
  g4.draw(c4c);
});

c5.addEventListener("mousemove", (event) => {
  oc.set(event.offsetX, event.offsetY);
  g5.apply_function(set_radial);
  c5c.clearRect(0, 0, c5.width, c5.height);
  g5.draw(c5c);
});

g1.draw(c1c);
g2.draw(c2c);
g3.draw(c3c);
g4.draw(c4c);
g5.draw(c5c);

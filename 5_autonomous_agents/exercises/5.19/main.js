import Vector from "./components/Vector.js";
import Boid from "./components/Boid.js";
import random from "./utils/random.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const box = { x: null, y: null };
const boids = [];
const config = [];
let isDragging;

function add_boid(position) {
  const boid = new Boid(position, ...config);

  boids.push(boid);
}

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let boid of boids) boid.run(context, boids, box);

  requestAnimationFrame(anime);
}

function init_controls() {
  const controlsControl = document.querySelector(".show-controls");
  const controlsContainer = document.querySelector(".controls-container");
  const count = document.querySelector(".count");

  controlsControl.addEventListener("change", () =>
    controlsContainer.classList.toggle("shown")
  );

  canvas.addEventListener("mousedown", () => (isDragging = true));

  canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    add_boid(new Vector(event.offsetX, event.offsetY));
  });

  canvas.addEventListener("mouseup", () => (isDragging = false));

  canvas.addEventListener("click", (event) => {
    add_boid(new Vector(event.offsetX, event.offsetY));

    count.innerText = `boids: ${boids.length}`;
  });
}

function init_config() {
  const labels = document.querySelectorAll(".control-label");

  labels.forEach((label, index) => {
    const input = label.querySelector("input");
    const query = input.dataset.query;
    const span = label.querySelector(".value");

    input.addEventListener("input", () => {
      let value, number;

      value = input[query];

      switch (value) {
        case "true":
          value = true;
          break;
        case "false":
          value = false;
        default:
          number = Number(value);

          if (!isNaN) value = number;
      }

      config[index] = value;
      span.innerText = value;

      boids.forEach((b) => b.set_parameters(config));
    });
  });

  //width:
  config[0] = 10;
  //height:
  config[1] = 5;
  //maxSpeed:
  config[2] = 20;
  //maxForce:
  config[3] = 5;
  //separationRadius:
  config[4] = 25;
  //neighboringRadius:
  config[5] = 50;
  //separationWeight:
  config[6] = 1;
  //alignmentWeight:
  config[7] = 1;
  //cohesionWeight:
  config[8] = 1;
  //color:
  config[9] = "#f5c211";
  //showDebug:
  config[10] = false;
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  box.x = { min: 0, max: innerWidth };
  box.y = { min: 0, max: innerHeight };

  init_controls();

  init_config();

  for (let i = 0; i < 10; i++) {
    const position = new Vector(random(0, innerWidth), random(0, innerHeight));

    add_boid(position);
  }

  requestAnimationFrame(anime);
}

init();

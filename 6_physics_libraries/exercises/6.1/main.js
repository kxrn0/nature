import Matter from "matter-js";
import add_ball from "./utils/add_ball";
import "./style.css";

const canvas = document.querySelector("canvas");
let world;

function create_world() {
  const engine = Matter.Engine.create();
  const options = {
    canvas,
    engine,
    options: {
      width: innerWidth,
      height: innerHeight,
    },
  };
  const renderer = Matter.Render.create(options);
  const ground = Matter.Bodies.rectangle(
    innerWidth / 2,
    innerHeight - 5,
    innerWidth,
    10,
    { isStatic: true }
  );
  const runner = Matter.Runner.create();

  world = engine.world;

  Matter.Composite.add(world, ground);
  Matter.Render.run(renderer);
  Matter.Runner.run(runner, engine);
}

function add(event) {
  add_ball(event.offsetX, event.offsetY, 10, world);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  create_world();

  canvas.addEventListener("click", add);
}

init();

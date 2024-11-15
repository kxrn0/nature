import { onMount, onCleanup, createSignal } from "solid-js";
import { Polygon } from "../../types";
import Matter from "matter-js";
import Body from "./classes/Body";
import Obstacle from "./classes/Obstacle";

type Props = {
  currentPolygon?: Polygon;
};

export default function World(props: Props) {
  const [animeId, setAnimeId] = createSignal(-1);
  let canvas!: HTMLCanvasElement;

  function handle_resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  onMount(() => {
    const context = canvas.getContext("2d")!;
    const engine = Matter.Engine.create();
    const obstacles: Obstacle[] = [];
    let bodies: Body[];

    if (!context) throw new Error("no context error!");

    function anime() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      Matter.Engine.update(engine);

      for (let obstacle of obstacles) obstacle.draw(context);

      for (let body of bodies) body.draw(context);

      bodies = bodies.filter(
        (body) => body.body.position.y < innerHeight + 300
      );

      setAnimeId(requestAnimationFrame(anime));
    }

    function init() {
      const obstacle = new Obstacle(
        Matter.Vector.create(innerWidth / 4, innerHeight - 100),
        innerWidth / 2 - 50,
        10
      );

      obstacles.push(obstacle);

      Matter.Composite.add(engine.world, obstacle.body);

      bodies = [];

      setAnimeId(requestAnimationFrame(anime));
    }

    canvas.addEventListener("click", (event) => {
      if (!props.currentPolygon) return;

      const body = new Body(
        [...props.currentPolygon.vertices],
        event.offsetX,
        event.offsetY
      );

      Matter.Composite.add(engine.world, body.body);
      bodies.push(body);
    });

    init();
  });

  onMount(() => {
    window.addEventListener("resize", handle_resize);
  });

  onCleanup(() => {
    cancelAnimationFrame(animeId());
    window.removeEventListener("resize", handle_resize);
  });

  return <canvas width={innerWidth} height={innerHeight} ref={canvas}></canvas>;
}

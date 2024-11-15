import Matter from "matter-js";
import fill_path from "../../../utils/drawing/fill_path";
import stroke_path from "../../../utils/drawing/stroke_path";
import random from "../../../utils/random";

export default class Body {
  body: Matter.Body;

  constructor(vertices: Matter.Vector[], x: number, y: number) {
    const options = { restitution: 0.2 };

    this.body = Matter.Bodies.fromVertices(x, y, [vertices], options);

    Matter.Body.setVelocity(this.body, Matter.Vector.create(random(-5, 5), 0));
    Matter.Body.setAngularVelocity(this.body, 0.1);
  }

  draw(context: CanvasRenderingContext2D) {
    fill_path(context, this.body.vertices, "gray");
    stroke_path(context, this.body.vertices, "black", 2, true);
  }
}

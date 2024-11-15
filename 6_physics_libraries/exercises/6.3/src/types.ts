import Matter from "matter-js";

export type Point = {
  x: number;
  y: number;
};

export type Polygon = {
  vertices: Matter.Vector[];
  original: string;
  thumbnail: string;
  id: string;
};

import Vector from "./Vector.js";

//The vector v equals (1, 5).
const v = new Vector(1, 5);

console.log(v);

//The vector u equals v multiplied by 2.
const u = Vector.scale(v, 2);

console.log(u);

//The vector w equals v minus u.
const w = Vector.add(v, Vector.scale(u, -1));

console.log(w);

//Divide the vector w by 3.

v.scale(1 / 3);

console.log(v);

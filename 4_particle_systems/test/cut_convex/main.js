/**
 * I want to write a function to cut a polygon into several smaller polygons.
 * I can use a line to cut a polygon and get several other polygons. Then cut those other
 * polygons in a similar way, and continue until I have enough. If I were working with convex
 * polygons only, a line would cut a polygon in only two pieces, but since the polygons I have can
 * also be convex, I can end up with several polygons with a single cut.
 *
 * I think I should assume the polygons are only convex first, and once I find a solution for that case
 * I can extend it.
 * Assume there's a convex polygon. I first select two different edges, and random points on each, then
 * I declare those points to be the intersections of the cutting line and the polygon. A polygon is
 * represented as an array of vertices. The vertices read clockwise, so to get the first cut I start at the
 * first intersection point, then continue to the next highest point, whatever that means, and so on, wrapping
 * around if necessary, until arriving to the second intersection point. I'd do something similar for the second
 * cut.
 * What the fuck does it even mean to get the next closest point? I think that is the endpoint of the linesegment
 * I cut.
 */

const oneCtx = one.getContext("2d");
const twoCtx = two.getContext("2d");
const center = new Vector(300, 300);

function fun() {
  oneCtx.clearRect(0, 0, one.width, one.height);
  twoCtx.clearRect(0, 0, two.width, two.height);
}

canvas.addEventListener("click", fun);

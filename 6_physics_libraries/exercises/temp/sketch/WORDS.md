# Polygons

I want to built a simple app where the user can draw polygons and add them to the world. The app will look like this

![](./concept.jpg)

The background will be a canvas that covers the entire screen, the user can add an instance of one of the selected shapes in the menu on the top left corner. The user can add new shapes to the menu with the widget on the top right corner. The menu and the widged can be dragged around the screen and closed.

I want to have an animation loop in the background canvas, and the widged, I'll try to componentize that. I'll be using a physics engine to update the states of the bodies in the background canvas. That physics engine comes with a renderer, so I'd like to toggle between debug view, and my own view, which may complicate componentizing the animation. That also means that I forgot a button to enable/disable debug view in the image above. I'll make that button draggable as well. That may complicate some aspects of dragging stuff in the canvas, in particular the part where I drag a draggable above another draggable. If I don't do anything the order in which the elements are in the HTML will dictate how they are rendered, for example, if I have A, B, and C, in that order in the HTML, and if I drag B around, it will move over A, and under C, always. I'd like to update the z-index, so that the element that is currently being dragged has the highest z-index. I'd need to get all other draggables when dragging starts. It'd be easier to imperatively update their z-index, which feels wrong since I'll be using a declarative framework, but since I'll be updating the animations 60 frames per second at best, I think there's more stuff I'll have to do that wouldn't make much sense to use a DOM framework for.

Since there's a menu from which the user can select what shapes to draw, and new shapes are added to that menu after being created by the drawing component, it seems like a lot of state will be controlled from above. There will be a component that will hold which shapes the menu is to display. Those shapes will be most likely in an array that we keep track of with a signal, so the menu is passed down a setter that it can use to remove shapes, since displaying and removing shapes is all the menu will do. It will also be draggable, and minimazable, but that's not something it itself would have to keep track of. This parent component that manages what shapes are drawn by the menu will also pass down a setter to the drawing component to add new shapes.

I feel like componentizing the animation would be more trouble than what it's worth it since I'd be basically just calling an init function that starts the animation; the code in whatever component uses the animation component wouldn't be significantly more complicated than if it the component were to set up the animation stuff itself.

For now I'll focus on the other components.

The menu displays the shapes and lets the user select one. How do I display the shapes? I want to display them as images. They should be displayed smaller than they are in reality. I need an image, I can just get one by calling `toDataURL` on the canvas before calling the parent setter in the factory, and the parent would hold polygon objects with two properties; the vertices array, and the image for the menu to display. That sounds about right, except that it kind of doesn't. If the user draws a small polygon that only takes a quarter of the screen then the resulting image will look weird with a lot of empty space. I Think I should do some for of the following:
Find the bounding box of the polygon, create a canvas with a specific size, like 100x100, scale the polygon and its bounding box to fit in this canvas, draw the polygon and extract the image as a data URL. I think I may have to translate the polygon so its centroid ends up at the origin.

Let's go about this a bit more carefully. First translate the polygon so its centroid is at the origin, then find its bounding box. Now scale the whole thing so that it fits perfectly in a 100x100 canvas. Then draw the polygon, and finally create an image from the canvas.

I'm not sure how I'll do the scaling thing. I think the way to do it would be by finding the longest side of the bounding box, finding the ratio of 100 to the longest side, and using this to scale everything. Would this actually work, and how do I scale things? do I just multiply the ratio by each vertex? Assume the longest side is 20, then the ratio is 100 / 20 = 5, multiplying every vertex by this ratio would make it five times as long. There's also the issue that now that all polygons are drawn to fit a 100x100 canvas there's no way to tell them appart in terms of size, which may be an issue, but I'll leave that for later.

For now I'll assume that's the right approach. Then I think the function could look like this

```javascript
function find_bb_dimensions(vertices) {
  const xMin = Math.min(...vertices.map((v) => v.x));
  const xMax = Math.max(...vertices.map((v) => v.x));
  const yMin = Math.min(...vertices.map((v) => v.y));
  const yMax = Math.max(...vertices.map((v) => v.y));
  const width = xMax - xMin;
  const height = yMax - yMin;
  const center = { x: xMin + width / 2, y: yMin + height / 2 };
  const box = {
    width,
    height,
    center,
  };

  return box;
}

function frame_polygon(vertices, width, height, fillStyle) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const box = find_bb_dimensions(vertices);
  const boxLongest = Math.max(box.width, box.height);
  const canvasShortest = Math.min(width, height);
  const scale = canvasShortest / boxLongest;
  const centered = vertices.map((v) => ({
    x: (v.x - box.center.x) * scale,
    y: (v.y - box.center.y) * scale,
  }));

  canvas.width = width;
  canvas.height = height;

  context.beginPath();
  context.fillStyle = fillStyle;
  context.translate(width / 2, height / 2);
  context.moveTo(centered[0].x, centered[0].y);

  for (let i = 1; i < centered.length; i++)
    context.lineTo(centered[i].x, centered[i].y);

  context.fill();

  return canvas.toDataURL();
}
```

I can get the images. Now what? As pointed out above, since the polygons are fit on a 100x100 image, they all look like they are at the same scale. I could add a footnote indicating the real dimensions of the bounding box, or I could add an area above the list of polygons to preview the real size, then I'd have to create two images, a thumbnail, and one for the actual size. I'll do the later. I could use the code I have so far to do that, but I think it would be a bit repetitive.

What do I want? I have a set of vertices which form a polygon. I want to draw the polygon twice and get the images. In the first case I can use the canvas I already have to produce the image I want, in the second case I can use a function like `frame_polygon` to get the image I want.

When removing a polygon, if the polygon being removed is the one currently selected, I want to set the current to the previous one, so if the polygons are

```
[A, B, C, D, E]
```

and the current one is `C`, then removing `C` would result in `B` being set to the current one. Or should it be in the opposite direction? I think it should. Setting the current polygon to the previous one moves the position of the current polygon to the beginning of the array, while setting it to the next one, which will take the place of the removed one, keeps the position of the current polygon the same as long as the position fits in the size of the array. So if the polygon to be removed is the one currently being selected, the current polygon title will be given to the polygon that would take the position of the removed polygon, the core of the logic would be similar to this:

```javascript
function update(polygons, current, remove) {
  let index;

  index = -1;

  if (current === remove) {
    index = polygons.findIndex((p) => p === remove);

    if (index !== -1) index = Math.max(0, Math.min(index, polygons.length - 2));
  }

  polygons = polygons.filter((p) => p !== remove);

  if (index !== -1) current = polygons[index] || null;

  return {
    polygons,
    current,
  };
}
```

After some tests

```javascript
function arreq(a, b) {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function test(p) {
  const { polygons, current } = update(p.polygons, p.current, p.remove);

  console.log("testing");
  console.log(JSON.stringify(p));

  if (arreq(polygons, p.expectedPolygons) && current === p.expectedCurrent)
    console.log(
      "%cpassed",
      "color: greenyellow; font-weight: bold; font-size: 20px;"
    );
  else
    console.log("%cfailed", "color: red; font-weight: bold; font-size: 20px");

  console.log(current);

  console.log(
    JSON.stringify({
      polygons,
      current,
    })
  );

  console.log("---------------");
}

const p1 = {
  polygons: ["a", "b", "c", "d", "e"],
  current: "c",
  remove: "d",
  expectedPolygons: ["a", "b", "c", "e"],
  expectedCurrent: "c",
};
const p2 = {
  polygons: ["a", "b", "c", "d", "e"],
  current: "c",
  remove: "c",
  expectedPolygons: ["a", "b", "d", "e"],
  expectedCurrent: "d",
};
const p3 = {
  polygons: ["a", "b", "c", "d", "e"],
  current: "c",
  remove: "e",
  expectedPolygons: ["a", "b", "c", "d"],
  expectedCurrent: "c",
};
const p4 = {
  polygons: ["a", "b", "c", "d", "e"],
  current: "e",
  remove: "e",
  expectedPolygons: ["a", "b", "c", "d"],
  expectedCurrent: "d",
};
const p5 = {
  polygons: ["a", "b", "c", "d", "e"],
  current: "a",
  remove: "a",
  expectedPolygons: ["b", "c", "d", "e"],
  expectedCurrent: "b",
};
const p6 = {
  polygons: ["a", "b", "c", "d", "e"],
  current: "b",
  remove: "a",
  expectedPolygons: ["b", "c", "d", "e"],
  expectedCurrent: "b",
};
const p7 = {
  polygons: ["a", "b"],
  current: "a",
  remove: "a",
  expectedPolygons: ["b"],
  expectedCurrent: "b",
};
const p8 = {
  polygons: ["a", "b"],
  current: "b",
  remove: "b",
  expectedPolygons: ["a"],
  expectedCurrent: "a",
};
const p9 = {
  polygons: ["a", "b"],
  current: "a",
  remove: "b",
  expectedPolygons: ["a"],
  expectedCurrent: "a",
};
const p10 = {
  polygons: ["a", "b"],
  current: "b",
  remove: "a",
  expectedPolygons: ["b"],
  expectedCurrent: "b",
};
const p11 = {
  polygons: ["a"],
  current: "a",
  remove: "a",
  expectedPolygons: [],
  expectedCurrent: null,
};
const p12 = {
  polygons: [],
  current: null,
  remove: "a",
  expectedPolygons: [],
  expectedCurrent: null,
};
const ps = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];

ps.forEach((p) => test(p));
```

I'm inclined to believe that this function is correct.

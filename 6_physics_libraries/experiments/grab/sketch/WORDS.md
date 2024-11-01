# Drag

I want to drag an element around the screen by its handle.

I can have a variable that indicates if the element is being dragged. When there's a `mousedown` event on the element's handle this variable is set to true, and it is set to false when there's a `mouseup` on the handle, or when it loses focus.

The `mousedown` event happens on the handle, so I know the element is going to be dragged. Now what? Now the user moves the mouse around the screen. The position of the element has to be updated accordingly. If I were moving a big circle, I could just set the position of the circle to the new location of the mouse, but since the handle could be anywhere in the body of the container, I have to consider that. I'll first try adding a vector from the corner of the handle to the corner of the container, adding that to the position of the mouse, and setting that as the new location.

This doesn't work.

```javascript
const container = document.querySelector(".container");
const handle = container.querySelector(".handle");
const cornerOffset = { x: 0, y: 0 };
let isDragging = false;

handle.addEventListener("mousedown", (event) => {
  const containerRekt = container.getBoundingClientRect();
  const handleRekt = handle.getBoundingClientRect();

  cornerOffset.x = handleRekt.x - containerRekt.x;
  cornerOffset.y = handleRekt.y - containerRekt.y;

  isDragging = true;
});

handle.addEventListener("mouseup", () => (isDragging = false));

handle.addEventListener("mouseout", () => (isDragging = false));

window.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  console.log(event.offsetX);

  const x = event.mouseX - cornerOffset.x;
  const xp = x / innerWidth;
  const y = event.mouseY - cornerOffset.y;
  const yp = y / innerHeight;

  container.style.setProperty("--x", `${xp}%`);
  container.style.setProperty("--y", `${yp}%`);
});
```

and it's mostly because I was guessing, so it looks like I need to understand how to do something to do it properly.

First, let's do something more familiar. If I have a canvas with a circle in it, I can move the circle by setting its center to the position of the mouse. The following sketch kind of works

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drag Circle</title>
    <style>
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        min-height: 100vh;
        display: grid;
        place-items: center;
      }

      canvas {
        border: 1px solid gray;
      }
    </style>
  </head>
  <body>
    <canvas width="600" height="600"></canvas>
    <script>
      const canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");
      const circle = {
        center: { x: canvas.width / 2, y: canvas.height / 2 },
        radius: 15,
        draw: function () {
          context.beginPath();
          context.fillStyle = "orange";
          context.arc(
            this.center.x,
            this.center.y,
            this.radius,
            0,
            Math.PI * 2
          );
          context.fill();
        },
      };
      let isDragging = false;

      function anime() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        circle.draw();

        requestAnimationFrame(anime);
      }

      function is_point_in_circle(point, circle) {
        const d2 =
          (circle.center.x - point.x) * (circle.center.x - point.x) +
          (circle.center.y - point.y) * (circle.center.y - point.y);
        const r2 = circle.radius * circle.radius;

        return d2 <= r2;
      }

      function init() {
        canvas.addEventListener("mousedown", (event) => {
          const point = { x: event.offsetX, y: event.offsetY };

          isDragging = is_point_in_circle(point, circle);
        });

        canvas.addEventListener("mousemove", (event) => {
          if (!isDragging) return;

          circle.center.x = event.offsetX;
          circle.center.y = event.offsetY;
        });

        canvas.addEventListener("mouseup", () => (isDragging = false));

        requestAnimationFrame(anime);
      }

      init();
    </script>
  </body>
</html>
```

but when the mouse is moved for first time the circle's center snaps immediately to the position of the mouse, which is noticeable for large circles. After the `mousedown` event we can construct a vector from the center of the circle and the point of contact. If we substract this vector to the position of the mouse when we want to move the circle we would get rid of the snapping. The script code would then look like this

```javascript
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const circle = {
  center: { x: canvas.width / 2, y: canvas.height / 2 },
  radius: 50,
  draw: function () {
    context.beginPath();
    context.fillStyle = "orange";
    context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    context.fill();
  },
};
const offset = { x: 0, y: 0 };
let isDragging = false;

function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  circle.draw();

  requestAnimationFrame(anime);
}

function is_point_in_circle(point, circle) {
  const d2 =
    (circle.center.x - point.x) * (circle.center.x - point.x) +
    (circle.center.y - point.y) * (circle.center.y - point.y);
  const r2 = circle.radius * circle.radius;

  return d2 <= r2;
}

function init() {
  canvas.addEventListener("mousedown", (event) => {
    const point = { x: event.offsetX, y: event.offsetY };

    if (is_point_in_circle(point, circle)) {
      offset.x = point.x - circle.center.x;
      offset.y = point.y - circle.center.y;
      isDragging = true;
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    circle.center.x = event.offsetX - offset.x;
    circle.center.y = event.offsetY - offset.y;
  });

  canvas.addEventListener("mouseup", () => (isDragging = false));

  requestAnimationFrame(anime);
}

init();
```

Can I use this logic to drag a fixed element around the screen?

That seems to be the case. Assuming no constraints, is there any need to change anything in any significant way to apply this to a drag handle on a larger element? I feel like it would only need some minimal changes. I'll be setting the position of the parent instead of that of the handle, so I think I'll add or substract some vector somewhere from a point in the parent to a point in the handle, their centers most likely. The parent container will be translated by -50% on both axis.

I tried this out

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drag Element</title>
    <style>
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        min-height: 100vh;
        display: grid;
        place-items: center;
      }

      .container {
        --x: 50%;
        --y: 50%;
        background: orange;
        position: fixed;
        top: var(--y);
        left: var(--x);
        transform: translate(-50%, -50%);
        padding: 10px;
        border-radius: 5px;
        width: 300px;
      }

      .container .handle {
        background-color: blue;
        width: 25px;
        height: 25px;
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="handle"></div>
      <h1>Lorem</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam, nobis.
      </p>
      <button>yes</button>
    </div>
    <script>
      const container = document.querySelector(".container");
      const containerRekt = container.getBoundingClientRect();
      const handle = container.querySelector(".handle");
      const handleRekt = handle.getBoundingClientRect();
      const circle = {
        center: {
          x: handleRekt.x + handleRekt.width / 2,
          y: handleRekt.y + handleRekt.height / 2,
        },
        radius: handleRekt.width / 2,
      };
      const bigOffset = {
        x: circle.center.x - containerRekt.x - containerRekt.width / 2,
        y: circle.center.y - containerRekt.y - containerRekt.height / 2,
      };
      const offset = { x: 0, y: 0 };
      let isDragging = false;

      function is_point_in_circle(point, circle) {
        const d2 =
          (circle.center.x - point.x) * (circle.center.x - point.x) +
          (circle.center.y - point.y) * (circle.center.y - point.y);
        const r2 = circle.radius * circle.radius;

        return d2 <= r2;
      }

      window.addEventListener("mousedown", (event) => {
        const point = { x: event.clientX, y: event.clientY };
        if (is_point_in_circle(point, circle)) {
          isDragging = true;
          offset.x = point.x - circle.center.x;
          offset.y = point.y - circle.center.y;
        }
      });

      window.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        const x = event.offsetX - offset.x - bigOffset.x;
        const y = event.offsetY - offset.y - bigOffset.y;

        container.style.setProperty("--x", `${x}px`);
        container.style.setProperty("--y", `${y}px`);
      });

      window.addEventListener("mouseup", () => (isDragging = false));
    </script>
  </body>
</html>
```

and it doesn't work, but it kind of does, just not correctly, it jumps between the place it should be and the upper left corner.

$...$
Looks like I'm retarded and used `offsetX` instead of `clientX` when moving. I also have to update the center of the circle when moving the element, so in the end the handle for `mousemove` is

```javascript
window.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  const xa = event.clientX - offset.x;
  const ya = event.clientY - offset.y;
  const x = xa - bigOffset.x;
  const y = ya - bigOffset.y;

  circle.center.x = xa;
  circle.center.y = ya;

  container.style.setProperty("--x", `${x}px`);
  container.style.setProperty("--y", `${y}px`);
});
```

Now I'd like to constrain the position of the element. The element should be completely inside the viewport at all times, so it shouldn't be possible to move a pixel of it outside.

Let's start with a simple example of a box.

First of all, I'll model a box the way it's done in most software; with the top left corner, width and height. How does the drag logic work in this case? Disregarding offset and allowing snapping, the corner of the box would be set to the mouse position. Since there's a transform of -50% on both axis, setting the corner to the mouse actually ends up with the mouse at the center of the box. I'll disable that transform. I'll probably have to change some logic devised in previous sketches to account for this.

For now there's this.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stay Inside</title>
    <style>
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background: rgb(43, 5, 43);
        min-height: 100vh;
      }

      .box {
        --x: 0;
        --y: 0;
        position: fixed;
        top: var(--y);
        left: var(--x);
        border-radius: 5px;
      }

      .box.a {
        --x: calc(33% - 25px);
        --y: calc(33% - 75px);
        background: orange;
        width: 50px;
        height: 150px;
      }

      .box.b {
        --x: calc(50% - 75px);
        --y: calc(50% - 75px);
        background: greenyellow;
        width: 150px;
        height: 150px;
      }

      .box.c {
        --x: calc(66% - 75px);
        --y: calc(66% - 25px);
        background: skyblue;
        width: 150px;
        height: 50px;
      }
    </style>
  </head>
  <body>
    <div class="box a"></div>
    <div class="box b"></div>
    <div class="box c"></div>
    <script>
      function is_point_in_rect(point, rect) {
        const x =
          rect.corner.x <= point.x && point.x <= rect.corner.x + rect.width;
        const y =
          rect.corner.y <= point.y && point.y <= rect.corner.y + rect.height;

        return x && y;
      }
    </script>
    <script>
      const elements = Array.from(document.querySelectorAll(".box"));
      const boxes = elements.map((element) => {
        const rekt = element.getBoundingClientRect();
        const box = {
          corner: { x: rekt.x, y: rekt.y },
          width: rekt.width,
          height: rekt.height,
          element,
          isBeingDragged: false,
          dragOffset: { x: 0, y: 0 },
        };

        return box;
      });

      window.addEventListener("mousedown", (event) => {
        const point = { x: event.clientX, y: event.clientY };

        for (let i = boxes.length - 1; i >= 0; i--) {
          const box = boxes[i];

          if (is_point_in_rect(point, box)) {
            event.preventDefault();

            box.isBeingDragged = true;
            box.dragOffset.x = point.x - box.corner.x;
            box.dragOffset.y = point.y - box.corner.y;
            break;
          }
        }
      });

      window.addEventListener("mousemove", (event) => {
        const box = boxes.find((box) => box.isBeingDragged);

        if (!box) return;

        const x = event.clientX - box.dragOffset.x;
        const y = event.clientY - box.dragOffset.y;

        box.corner = { x, y };

        box.element.style.setProperty("--x", `${x}px`);
        box.element.style.setProperty("--y", `${y}px`);
      });

      window.addEventListener("mouseup", () =>
        boxes.forEach((box) => (box.isBeingDragged = false))
      );
    </script>
  </body>
</html>
```

I can move a box, how do I keep the entirety of it inside the viewport? I feel like I only need to change a couple of lines in the example above, something like `box.corner.x = Math.min(Math.max(x, 0), innerWidth - box.width)`.

That seems to work; this is the only change I need to make.

```javascript
window.addEventListener("mousemove", (event) => {
  const box = boxes.find((box) => box.isBeingDragged);

  if (!box) return;

  const xa = event.clientX - box.dragOffset.x;
  const ya = event.clientY - box.dragOffset.y;
  const x = Math.min(Math.max(xa, 0), innerWidth - box.width);
  const y = Math.min(Math.max(ya, 0), innerHeight - box.height);

  box.corner = { x, y };

  box.element.style.setProperty("--x", `${x}px`);
  box.element.style.setProperty("--y", `${y}px`);
});
```

How do I apply this to a handle inside an element? After messing around with a sketch I think I found the solution:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stay Inside</title>
    <style>
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background-color: rgb(5, 12, 104);
        min-height: 100vh;
      }

      .container {
        --x: calc(50% - 100px);
        --y: 50%;
        background-color: orange;
        border-radius: 5px;
        width: 200px;
        padding: 10px;
        position: fixed;
        top: var(--y);
        left: var(--x);
      }

      .container .nav {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .container .handle {
        background: blueviolet;
        width: 50px;
        height: 25px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="nav">
        <p>hi</p>
        <div class="handle"></div>
      </div>
      <h1>Lorem</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum,
        placeat!
      </p>
      <button>click</button>
    </div>
    <script>
      function is_point_in_rect(point, rect) {
        const x =
          rect.corner.x <= point.x && point.x <= rect.corner.x + rect.width;
        const y =
          rect.corner.y <= point.y && point.y <= rect.corner.y + rect.height;

        return x && y;
      }
    </script>
    <script>
      const container = document.querySelector(".container");
      const containerRekt = container.getBoundingClientRect();
      const handle = container.querySelector(".handle");
      const handleRekt = handle.getBoundingClientRect();
      const box = {
        corner: { x: handleRekt.x, y: handleRekt.y },
        width: handleRekt.width,
        height: handleRekt.height,
        parentOffset: {
          x: handleRekt.x - containerRekt.x,
          y: handleRekt.y - containerRekt.y,
        },
        parentWidth: containerRekt.width,
        parentHeight: containerRekt.height,
        dragOffset: { x: 0, y: 0 },
        isBeingDragged: false,
        element: container,
      };

      window.addEventListener("mousedown", (event) => {
        const point = { x: event.clientX, y: event.clientY };

        if (is_point_in_rect(point, box)) {
          event.preventDefault();

          box.isBeingDragged = true;
          box.dragOffset.x = point.x - box.corner.x;
          box.dragOffset.y = point.y - box.corner.y;
        }
      });

      window.addEventListener("mousemove", (event) => {
        if (!box.isBeingDragged) return;

        const xp = event.clientX - box.dragOffset.x - box.parentOffset.x;
        const yp = event.clientY - box.dragOffset.y - box.parentOffset.y;
        const xf = Math.min(innerWidth - box.parentWidth, Math.max(0, xp));
        const yf = Math.min(innerHeight - box.parentHeight, Math.max(0, yp));
        const x = xf + box.parentOffset.x;
        const y = yf + box.parentOffset.y;

        box.corner = { x, y };

        container.style.setProperty("--x", `${xf}px`);
        container.style.setProperty("--y", `${yf}px`);
      });

      window.addEventListener("mouseup", () => (box.isBeingDragged = false));
    </script>
  </body>
</html>
```

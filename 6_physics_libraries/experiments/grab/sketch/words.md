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

and it's mostly because I was guessing, so it looks like I need to understand how to do something do do it properly.

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

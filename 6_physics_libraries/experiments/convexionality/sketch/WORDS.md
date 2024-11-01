# Concave, Convex or Complex

I want to determine if a polygon is concave, convex, or complex, but first I have to build an app where I can add a bunch of points to create a polygon. Just for fun, I'll also make it possible to move the polygon around with the mouse.

How do I add a polygon to the screen? In the beginning there's nothing, and when the user first triggers a click event a point is added to the canvas where the user clicked. That point is added to an array of points, and a line is continuosly drawn from the point to the mouse. So I'll need a boolean variable that will indicate if the user is adding a new polygon.

Before the first click that variable is false, but after it it is set to true.

I have something going on down there

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Polygon</title>
    <style>
      *,
      *::before,
      *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        background-color: rgb(19, 4, 48);
        display: grid;
        place-items: center;
        min-height: 100vh;
      }

      .controls {
        background-color: rgba(183, 170, 157, 0.5);
        color: white;
        position: fixed;
        top: 25px;
        right: 25px;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    </style>
  </head>
  <body>
    <canvas></canvas>
    <div class="controls">
      <label>
        <span>move polygon</span>
        <input type="radio" name="radio-group" id="radio-move" />
      </label>
      <label>
        <span>add polygon</span>
        <input type="radio" name="radio-group" id="radio-add" checked />
        <button>reset</button>
      </label>
    </div>
    <script>
      function Polygon(vertices) {
        //check that the vertices are arranged in a clockwise manner
        //give it the correct type
        const type = Polygon.types.CONVEX; //fix this

        this.vertices = vertices;
        this.type = type;

        switch (type) {
          case Polygon.types.CONVEX:
            this.color = "greenyellow";
            break;
          case Polygon.types.CONCAVE:
            this.color = "orange";
            break;
          case Polygon.types.COMPLEX:
            this.color = "red";
            break;
        }
      }

      Polygon.prototype.draw = function (context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++)
          context.lineTo(this.vertices[i].x, this.vertices[i].y);
        context.fill();
      };

      Polygon.types = {
        CONVEX: "CONVEX",
        CONCAVE: "CONCAVE",
        COMPLEX: "COMPLEX",
      };
    </script>
    <script>
      function is_point_in_circle(point, circle) {
        const d2 =
          (circle.center.x - point.x) * (circle.center.x - point.x) +
          (circle.center.y - point.y) * (circle.center.y - point.y);
        const r2 = circle.radius * circle.radius;

        return d2 <= r2;
      }

      function draw_circle(context, center, radius, color) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(center.x, center.y, radius, 0, Math.PI * 2);
        context.fill();
      }

      function draw_path(context, vertices) {
        if (vertices.length > 1) {
          context.beginPath();
          context.strokeStyle = "skyblue";
          context.moveTo(vertices[0].x, vertices[0].y);
          for (let i = 1; i < vertices.length; i++)
            context.lineTo(vertices[i].x, vertices[i].y);
          context.stroke();
        }

        for (let vertex of vertices) {
          draw_circle(context, vertex, 5, "gray");
        }
      }
    </script>
    <script>
      const canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");
      const polygons = [];
      let tempVertices, isBuilding, isAdding, pot, isClose;

      function anime() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let polygon of polygons) polygon.draw(context);

        if (isBuilding) {
          draw_path(context, [...tempVertices, pot]);

          if (isClose)
            draw_circle(context, tempVertices[0], 10, "rgb(100, 255, 200, .5)");
        }

        requestAnimationFrame(anime);
      }

      function init() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;

        tempVertices = [];
        isBuilding = false;
        isAdding = true;
        pot = { x: 0, y: 0 };

        window.addEventListener("click", (event) => {
          if (isAdding) {
            const vertex = { x: event.offsetX, y: event.offsetY };
            const center = tempVertices[0];
            const circle = { center: center, radius: 10 };

            if (
              center &&
              is_point_in_circle(vertex, circle) &&
              tempVertices.length >= 2
            ) {
              const polygon = new Polygon(tempVertices);

              polygons.push(polygon);
              tempVertices = [];
              isBuilding = false;
            } else {
              isBuilding = true;
              tempVertices.push(vertex);
              pot.x = vertex.x;
              pot.y = vertex.y;
            }
          } else {
          }
        });

        window.addEventListener("mousemove", (event) => {
          if (isAdding && isBuilding) {
            const circle = { center: tempVertices[0], radius: 10 };

            pot.x = event.offsetX;
            pot.y = event.offsetY;

            if (tempVertices.length > 2 && is_point_in_circle(pot, circle))
              isClose = true;
            else isClose = false;
          } else {
          }
        });

        requestAnimationFrame(anime);
      }

      init();
    </script>
  </body>
</html>
```

There's an [answer in SO](https://stackoverflow.com/questions/471962/how-do-i-efficiently-determine-if-a-polygon-is-convex-non-convex-or-complex/45372025#45372025) that claims to answer if a polygon is strictly convex. Checking that a polygon is strictly convex or not is enough for me, so I'll have the Polygon class have only two types instead of three.

I have an array of vertices, and I need them to be listed in clockwise order, or counterclockwise with respect to the coordinate axes. 

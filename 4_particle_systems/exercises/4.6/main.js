const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const gravity = { x: 0, y: 1 };
const polygons = [];
/**
 * When clicking on the canvas, if the click lands on a polygon, destroy that polygon,
 * and scatter its remains. Otherwise spawn a polygon in there.
 */



function anime() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = polygons.length - 1; i >= 0; i--) {
    polygons[i].run(context, gravity);

    if (polygons[i].is_dead()) polygons.splice(i, 1);
  }

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const clicked = polygons.findIndex((poly) => {
      const vertices = poly.reduce((array, vertex) => {
        array.push(vertex.x, vertex.y);

        return array;
      }, []);
      const wasClicked = ContainsPoint(vertices, event.clientX, event.clientY);

      return wasClicked;
    });

    if (clicked) {
      clicked.explode();
    } else {

    }
  });

  requestAnimationFrame(anime);
}

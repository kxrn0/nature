const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const box = {
  corner: new Vector(0, 0),
  width: 0,
  height: 0,
};
const fires = [];
let isLighting = false;

function draw_box() {
  context.beginPath();
  context.strokeStyle = "red";
  context.strokeRect(box.corner.x, box.corner.y, box.width, box.height);
}

function anime() {
  context.fillSyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let fire of fires) fire.burn(context);

  if (isLighting) draw_box();

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("mousedown", (event) => {
    isLighting = true;
    box.corner = new Vector(event.offsetX, event.offsetY);
    box.width = 0;
    box.height = 0;
  });

  canvas.addEventListener("mouseup", () => {
    const fire = new Fire(box.corner, box.width, box.height);

    fires.push(fire);

    isLighting = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    box.width = event.offsetX - box.corner.x;
    box.height = event.offsetY - box.corner.y;
  });

  requestAnimationFrame(anime);
}

init();

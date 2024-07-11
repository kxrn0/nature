const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const fires = [];

function anime() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let fire of fires) {
    fire.add_particles(1);
    fire.burn(context);
  }

  console.log(fires[0]?.particles.length)

  requestAnimationFrame(anime);
}

function init() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  canvas.addEventListener("click", (event) => {
    const origin = new Vector(event.offsetX, event.offsetY);
    const fire = new Fire(origin);

    fires.push(fire);
  });

  requestAnimationFrame(anime);
}

init();

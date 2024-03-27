import Asteroid from "./Asteroid";
import Player from "./Player";
import Vector from "./Vector";
import random from "./random";
import check_as_to_as_collision from "./check_as_to_ass_collision";
import collide from "./collide";
import Source from "./Source";
import add_asteroid from "./add_asteroid";
import message from "./message";
import "./style.css";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
let player, bullets, asteroids, sources, state, animeId;

function add_bullet(bullet) {
  bullets.push(bullet);
}

function destroy_bullet(bullet) {
  bullets = bullets.filter((other) => other !== bullet);
}

function anime() {
  context.fillStyle = "#321241";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "black";
  context.arc(canvas.width / 2, 100, random(25, 50), 0, Math.PI * 2);
  context.fill();

  add_asteroid(new Vector(canvas.width / 2, 100), 10, 0.01, asteroids, canvas);

  player.update();

  if (player.energy <= 0) {
    return end_game();
  }

  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    const deff = player.maxEnergy - player.energy;

    source.draw();

    if (source.amount < 1.5 * deff) {
      source.draw("green");

      if (collide(player, source)) {
        player.add_energy(source.amount);

        sources = sources.filter((other) => other !== source);
      }
    } else source.draw("blue");
  }

  for (let bullet of bullets) {
    bullet.update();
  }

  for (let asteroid of asteroids) {
    asteroid.update();

    if (collide(asteroid, player)) return end_game();
  }

  for (let i = 0; i < asteroids.length; i++)
    for (let j = i + 1; j < asteroids.length; j++)
      check_as_to_as_collision(asteroids[i], asteroids[j]);

  for (let i = bullets.length - 1; i >= 0; i--) {
    const bull = bullets[i];

    for (let asteroid of asteroids) {
      if (collide(bull, asteroid)) {
        const source = new Source(
          asteroid.position.copy(),
          10,
          asteroid.radius,
          canvas
        );

        sources.push(source);
        bullets = bullets.filter((other) => other !== bull);
        asteroids = asteroids.filter((other) => other !== asteroid);
      }
    }
  }

  animeId = requestAnimationFrame(anime);
}

function init() {
  const position = new Vector(canvas.width / 2, canvas.height / 2);
  const velocity = new Vector(0, 0);
  const drag = 0.9;
  const acc = 1;
  const radius = 15;
  const energy = 100;
  const maxEnergy = 100;
  const dH = 0.1;

  player = new Player(
    position,
    velocity,
    drag,
    acc,
    canvas,
    radius,
    energy,
    maxEnergy,
    dH,
    add_bullet,
    destroy_bullet,
    false
  );
  bullets = [];
  asteroids = [];
  sources = [];
  state = "paused";
}

function end_game() {
  player.kill();
  cancelAnimationFrame(animeId);
  message(
    "Game over! click on the screen to play again!",
    "back",
    "greenyellow",
    canvas
  );
  init();
}

function mount() {
  message("Click on the screen to begin!", "black", "greenyellow", canvas);

  init();
}

canvas.addEventListener("click", () => {
  if (state !== "paused") return;

  player.paused = false;
  state = "playing";
  anime();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();

  if (key !== "P") return;

  if (state === "playing") {
    player.paused = true;
    state = "paused";
    cancelAnimationFrame(animeId);
    message("Paused", "#00000099", "greenyellow", canvas);

    console.log("paused!");
  } else {
    player.paused = false;
    state = "playing";
    anime();
  }
});

mount();

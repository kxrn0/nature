import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import create_light from "./create_light";
import Ball from "./Ball";
import random from "./random";
import Vector from "./Vector";
import "./style.css";

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const scene = new THREE.Scene();
const fov = 75;
const aspect = 1.25;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const controls = new OrbitControls(camera, renderer.domElement);
const balls = [];

function anime() {
  balls.forEach((ball) => ball.move());
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(anime);
}

function init() {
  const lighta = create_light(0x87deff, 5, 1, 1, 1);
  const lightb = create_light(0xcdefff, 10, -1, -1, -1);
  const boxW = 60;
  const boxH = 140;
  const boxD = 100;
  const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0x1234ab,
    transparent: true,
    opacity: 0.5,
  });
  const box = new THREE.Mesh(boxGeo, boxMaterial);
  const maxSpeed = 1;

  for (let i = 0; i < 10; i++) {
    const color = random(0, 16777215);
    const position = new Vector(random(0, 10), random(0, 10), random(0, 10));
    const velocity = new Vector(
      random(-maxSpeed, maxSpeed),
      random(-maxSpeed, maxSpeed),
      random(-maxSpeed, maxSpeed)
    );
    const radius = random(1, 5);
    const boundaries = {
      x: { min: radius - boxW / 2, max: boxW / 2 - radius },
      y: { min: radius - boxH / 2, max: boxH / 2 - radius },
      z: { min: radius - boxD / 2, max: boxD / 2 - radius },
    };

    const ball = new Ball(color, position, velocity, radius, boundaries);

    ball.add_to_scene(scene);
    balls.push(ball);
  }

  camera.position.z = 100;
  scene.add(box);
  scene.add(lighta);
  scene.add(lightb);

  requestAnimationFrame(anime);
}

init();

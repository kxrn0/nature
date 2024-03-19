import * as THREE from "three";
import create_cube from "./create_cube";
import random from "./random";
import "./style.css";

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const scene = new THREE.Scene();
const fov = 75;
const aspect = 2;
const near = 0.01;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const cubes = [];

function anime(time) {
  time /= 1000;

  for (let i = 0; i < cubes.length; i++) {
    const speed = 1 + i * 0.1;
    const rotation = time * speed;

    cubes[i].rotation.x = rotation;
    cubes[i].rotation.y = rotation;
  }

  renderer.render(scene, camera);

  requestAnimationFrame(anime);
}

function init() {
  const lightColor = 0x87deff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(lightColor, intensity);
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  camera.position.z = 5;
  light.position.set(-1, 2, 4);
  scene.add(light);

  for (let i = -2; i < 4; i += 2) {
    const cube = create_cube(geometry, random(0, 16777215), {
      x: i,
      y: 0,
      z: 0,
    });

    cubes.push(cube);
    scene.add(cube);
  }

  requestAnimationFrame(anime);
}

init();

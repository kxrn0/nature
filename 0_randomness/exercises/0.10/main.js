import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import random from "./random";
import map from "./map";
import "./style.css";

const noise3d = createNoise3D();
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const scene = new THREE.Scene();
const fov = 75;
const aspect = 1.25;
const near = 0.01;
const far = 5000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const cubes = [];
const boxL = 1;
let prevTime, d;

function anime(timestamp) {
  const dt = timestamp - prevTime;

  prevTime = timestamp;

  for (let cube of cubes) {
    const { x, y } = cube.position;
    const n = noise3d(x / 10, y / 10, d);
    const z = map(n, -1, 1, -boxL, boxL);

    cube.position.z = z;
  }

  renderer.render(scene, camera);

  d += 0.01;
  requestAnimationFrame(anime);
}

function init() {
  const lightColor = 0x87deff;
  const intensity = 25;
  const light = new THREE.DirectionalLight(lightColor, intensity);
  const geometry = new THREE.BoxGeometry(boxL, boxL, boxL);
  const fogColor = 0x99deff;
  const fogNear = 1;
  const fogFar = 60;
  const fog = new THREE.Fog(fogColor, fogNear, fogFar);
  const background = new THREE.Color("#99deff");
  const worldW = 120;
  const worldH = 120;

  light.position.set(0, 0, 10);
  camera.position.z = 10;
  camera.position.y = -10;
  camera.rotateX(1);
  scene.add(light);
  scene.background = background;
  scene.fog = fog;

  for (let x = -worldW / 2; x < worldW / 2; x++) {
    for (let y = -worldH / 2; y < worldH / 2; y++) {
      const color = ~~random(200, 255);
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.1,
        metalness: 0.9,
      });
      const cube = new THREE.Mesh(geometry, material);

      scene.add(cube);
      cubes.push(cube);

      cube.position.x = x * boxL;
      cube.position.y = y * boxL;
    }
  }

  prevTime = 0;
  d = 0;

  requestAnimationFrame(anime);
}

init();

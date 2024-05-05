import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Body from "./Body";
import random from "./random";
import "./style.css";

const canvas = document.querySelector("canvas");
const scenegraph = {};
const bodies = [];

function anime() {
  for (let body of bodies) {
    for (let other of bodies) {
      const p = random() < 0.1;
      if (body !== other) body.attract(other, p);
    }

    body.move();
  }

  scenegraph.controls.update();
  scenegraph.renderer.render(scenegraph.scene, scenegraph.camera);

  requestAnimationFrame(anime);
}

function init_scene(scenegraph, canvas) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1e6;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const scene = new THREE.Scene();
  const controls = new OrbitControls(camera, canvas);
  const color = 0xffffff;
  const intensity = 10;
  const light = new THREE.AmbientLight(color, intensity);

  light.position.set(-1, -2, 5);

  scene.add(light);

  camera.position.z = 10;

  scenegraph.renderer = renderer;
  scenegraph.scene = scene;
  scenegraph.camera = camera;
  scenegraph.controls = controls;
}

function init() {
  const d = 50;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init_scene(scenegraph, canvas);

  for (let i = 0; i < 500; i++) {
    const position = new THREE.Vector3(
      random(-d, d),
      random(-d, d),
      random(-d, d)
    );
    const velocity = new THREE.Vector3(0, 0, 0);
    const radius = 2;
    const mass = (Math.PI * Math.pow(radius, 3) * 4) / 3;
    const color = 0xff0000;
    const detail = 1;
    const body = new Body(position, velocity, radius, mass, color, detail);

    bodies.push(body);

    scenegraph.scene.add(body.mesh);
  }

  const position1 = new THREE.Vector3(10, 0, 0);
  const velocity = new THREE.Vector3(0, 0, 0);
  const radius = 1;
  const mass = 1e3;
  const color = 0xffffff;
  const detail = 2;
  const hole1 = new Body(position1, velocity, radius, mass, color, detail);

  bodies.push(hole1);

  scenegraph.scene.add(hole1.mesh);

  requestAnimationFrame(anime);
}

init();

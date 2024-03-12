import * as THREE from "three";

export default function create_cube(geometry, color, position) {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.x = position.x;
  cube.position.y = position.y;
  cube.position.z = position.z;

  return cube;
}

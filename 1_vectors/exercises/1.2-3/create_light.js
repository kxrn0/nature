import * as THREE from "three";

export default function create_light(color, intensity, x, y, z) {
  const light = new THREE.DirectionalLight(color, intensity);

  light.position.set(x, y, z);

  return light;
}

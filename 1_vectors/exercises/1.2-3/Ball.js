import * as THREE from "three";

export default function Ball(color, position, velocity, radius, boundaries) {
  const geometry = new THREE.SphereGeometry(radius);
  const material = new THREE.MeshPhongMaterial({ color });

  this.mesh = new THREE.Mesh(geometry, material);
  this.position = position;
  this.velocity = velocity;
  this.radius = radius;
  this.boundaries = boundaries;

  this.move = function () {
    const x = this.position.x + this.velocity.x;
    const y = this.position.y + this.velocity.y;
    const z = this.position.z + this.velocity.z;

    if (this.boundaries.x.min < x && x < this.boundaries.x.max)
      this.position.x = x;
    else this.velocity.x *= -1;

    if (this.boundaries.y.min < y && y < this.boundaries.y.max)
      this.position.y = y;
    else this.velocity.y *= -1;

    if (this.boundaries.z.min < z && z < this.boundaries.z.max)
      this.position.z = z;
    else this.velocity.z *= -1;

    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  };

  this.add_to_scene = function (scene) {
    scene.add(this.mesh);
  };
}

import * as THREE from "three";

export default function Body(position, velocity, radius, mass, color, detail) {
  this.velocity = velocity.clone();
  this.acceleration = new THREE.Vector3(0, 0, 0);
  this.mass = mass;
  this.radius = radius;
  this.material = new THREE.MeshPhongMaterial({ color });
  this.geometry = new THREE.OctahedronGeometry(radius, detail);
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.copy(position);

  this.get_mesh = function () {
    return this.mesh;
  };

  this.apply_force = function (force) {
    force = force.clone().multiplyScalar(1 / this.mass);
    force = force.clone();
    this.acceleration.add(force);
  };

  this.attract = function (other, p) {
    const force = new THREE.Vector3(
      this.mesh.position.x - other.mesh.position.x,
      this.mesh.position.y - other.mesh.position.y,
      this.mesh.position.z - other.mesh.position.z
    ).clampLength(5, this.mass * 10);
    const length = force.length();
    const strength = (Body.G * (this.mass * other.mass)) / (length * length);

    force.setLength(strength);
    other.apply_force(force);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.mesh.position.add(this.velocity);
    this.acceleration.multiplyScalar(0);
  };
}

Body.G = .1;

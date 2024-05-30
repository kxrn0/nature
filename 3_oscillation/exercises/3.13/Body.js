import Vector from "./Vector";
import is_point_in_circle from "./is_point_in_circle";

export default function Body(position, velocity, radius, mass, damping, color) {
  this.position = position.clone();
  this.velocity = velocity.clone();
  this.acceleration = new Vector(0, 0);
  this.radius = radius;
  this.mass = mass;
  this.damping = damping;
  this.color = color;
  this.isDragging = false;
  this.dragOffset = new Vector(0, 0);

  this.apply_force = function (force) {
    force = force.clone();
    force.scale(1 / this.mass);

    this.acceleration.add(force);
  };

  this.move = function () {
    this.velocity.add(this.acceleration);
    this.velocity.scale(this.damping);
    this.position.add(this.velocity);
    this.acceleration.scale(0);
  };

  this.draw = function (context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fill();
  };

  this.handle_click = function (mouse) {
    if (is_point_in_circle(this, mouse)) {
      this.isDragging = true;
      this.dragOffset.copy(Vector.add(this.position, mouse.clone().scale(-1)));
    }
  };

  this.release = function () {
    this.isDragging = false;
  };

  this.drag = function (mouse) {
    if (this.isDragging) this.position.copy(Vector.add(mouse, this.dragOffset));
  };
}

export default function System(spring, bob) {
  this.spring = spring;
  this.bob = bob;

  this.apply_force = function (force) {
    this.bob.apply_force(force);
  };

  this.move = function () {
    this.spring.connect(this.bob);
    this.bob.move();
  };

  this.draw = function (context) {
    this.spring.draw(context, bob.position);
    this.bob.draw(context);
  };
}

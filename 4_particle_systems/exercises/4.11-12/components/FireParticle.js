function FireParticle(position, sprite, size) {
  Body.call(this, position, size);

  this.size = size;
  this.sprite = sprite;
}

Object.setPrototypeOf(FireParticle.prototype, Body.prototype);

FireParticle.prototype.draw = function (context) {
  context.beginPath();
  context.drawImage(
    this.sprite,
    this.position.x - this.size / 2,
    this.position.y - this.size / 2,
    this.size,
    this.size
  );
};

FireParticle.prototype.run = function (context) {
  this.move();
  this.draw(context);
};

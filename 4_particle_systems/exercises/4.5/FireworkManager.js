function FireworkManager(position, orientation) {
  this.position = position.clone();
  this.orientation = orientation;
  this.isDragging = false;
  this.fireworks = [];

  this.key_bind = this.listen_key.bind(this);
  this.down_bind = this.listen_down.bind(this);
  this.drag_bind = this.listen_drag.bind(this);
  this.up_bind = this.listen_up.bind(this);

  window.addEventListener("keydown", this.key_bind);

  window.addEventListener("mousedown", this.down_bind);

  window.addEventListener("mousemove", this.drag_bind);

  window.addEventListener("mouseup", this.up_bind);
}

FireworkManager.prototype.listen_key = function (event) {
  switch (event.key) {
    case "ArrowLeft":
      this.orientation = clamp(
        -Math.PI,
        this.orientation - FireworkManager.dA,
        0
      );
      break;
    case "ArrowRight":
      this.orientation = clamp(
        -Math.PI,
        this.orientation + FireworkManager.dA,
        0
      );
      break;
    case "Enter":
    case " ":
      const fuel = 500;
      const burnRate = 5;
      const mass = 1500;
      const base = 10;
      const firework = new Firework(
        this.position,
        this.orientation,
        fuel,
        burnRate,
        mass,
        base
      );

      firework.ignite();

      console.log(JSON.stringify(firework));

      this.fireworks.push(firework);
      break;
  }
};

FireworkManager.prototype.listen_down = function (event) {
  if (event.clientY < this.position.y) {
    const point = { x: event.clientX, y: event.clientY };
    const circle = { radius: FireworkManager.radius, center: this.position };

    if (is_point_in_circle(point, circle)) {
      this.set_angle(event);
      this.isDragging = true;
    }
  }
};

FireworkManager.prototype.listen_drag = function (event) {
  if (this.isDragging) this.set_angle(event);
};

FireworkManager.prototype.listen_up = function () {
  this.isDragging = false;
};

FireworkManager.prototype.set_angle = function (event) {
  const x = event.clientX - this.position.x;
  const y = event.clientY - this.position.y;

  const angle = Math.atan2(y, x);

  this.orientation = clamp(-Math.PI, angle, 0);
};

FireworkManager.prototype.kms = function () {
  window.removeEventListener("keydown", this.key_bind);

  window.removeEventListener("mousedown", this.click_bind);

  window.removeEventListener("mousemove", this.drag_bind);

  window.removeEventListener("mouseup", this.up_bind);
};

FireworkManager.prototype.draw = function (context) {
  context.beginPath();
  context.fillStyle = "red";
  context.arc(
    this.position.x,
    this.position.y,
    FireworkManager.radius,
    -Math.PI,
    0
  );
  context.fill();
  context.beginPath();
  context.strokeStyle = "yellow";
  context.lineWidth = 5;
  context.moveTo(this.position.x, this.position.y);
  context.lineTo(
    FireworkManager.radius * Math.cos(this.orientation) + this.position.x,
    FireworkManager.radius * Math.sin(this.orientation) + this.position.y
  );
  context.stroke();
};

FireworkManager.prototype.run = function (context, force) {
  for (let i = this.fireworks.length - 1; i >= 0; i--) {
    this.fireworks[i].run(context, force);

    if (this.fireworks[i].is_dead()) this.fireworks.splice(i, 1);
  }

  this.draw(context);
};

FireworkManager.radius = 50;

FireworkManager.dA = 0.1;

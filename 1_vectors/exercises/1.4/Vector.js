export default function Vector(x, y, z, maxLength) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.maxLength = Math.abs(maxLength) || Number.POSITIVE_INFINITY;

  this.add = function (other) {
    if (this.maxLength > Number.POSITIVE_INFINITY) {
      this.x += other.x;
      this.y += other.y;
      this.z += other.z;
    } else {
      const added = new Vector(
        this.x + other.x,
        this.y + other.y,
        this.z + other.z
      );
      const magnitude = added.get_magnitude();

      if (magnitude < this.maxLength) {
        this.set_to(new Vector(added.x, added.y, added.z, this.maxLength));
      } else throw new Error("Resulting vector is too long!");
    }
  };

  this.scale = function (n) {
    if (this.maxLength === Number.POSITIVE_INFINITY) {
      this.x *= n;
      this.y *= n;
      this.z *= n;
    } else {
      const scaled = new Vector(this.x * n, this.y * n, this.z * n);
      const magnitude = scaled.get_magnitude();

      if (magnitude > this.maxLength)
        throw new Error(
          "Can't scale to have magnitude greater than max length!"
        );

      this.set_to(scaled);
    }
  };

  this.get_magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };

  this.get_normal = function () {
    const magnitude = this.get_magnitude();

    if (!magnitude) return new Vector(0, 0);

    return new Vector(
      this.x / magnitude,
      this.y / magnitude,
      Number.POSITIVE_INFINITY
    );
  };

  this.get_xy_angle = function () {
    return Math.atan2(this.y, this.x);
  };

  this.get_xz_angle = function () {
    return Math.atan2(this.z, this.z);
  };

  this.get_yz_angle = function () {
    return Math.atan2(this.z, this.y);
  };

  this.set_to = function (other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.maxLength = other.maxLength;
  };

  this.set_magnitude = function (magnitude) {
    if (magnitude > this.maxLength)
      throw new Error("Can't set magnitude greater than maximum length!");

    const normal = this.get_normal();
    const scaled = normal.scale(magnitude);

    this.set_to(scaled);
  };

  this.set_max_length = function (maxLength) {
    this.maxLength = maxLength;
  };

  this.normalize = function () {
    this.normal = this.get_normal();

    this.set_to(normal);
  };
}

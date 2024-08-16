export default function PathManager(path) {
  this.path = path;
  this.vehicles = [];
}

PathManager.prototype.add_vehicle = function (vehicle) {
  this.vehicles.push(vehicle);
};

PathManager.prototype.run = function (context) {
  this.path.draw(context);

  for (let vehicle of this.vehicles) {
    vehicle.follow(this.path);
    vehicle.run(context);
  }
};

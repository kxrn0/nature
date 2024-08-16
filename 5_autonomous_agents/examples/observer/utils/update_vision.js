import Vector from "../components/Vector.js";

export default function update_vision(observer) {
  const dir = Vector.from_angle(observer.angle, observer.width / 2);
  const v1 = observer.position.clone().add(dir);
  const v2 = Vector.from_angle(
    observer.angle + observer.vision.angle / 2,
    observer.vision.edgeLength
  ).add(v1);
  const v3 = Vector.from_angle(
    observer.angle - observer.vision.angle / 2,
    observer.vision.edgeLength
  ).add(v1);

  observer.vision.vertices = [v1, v2, v3];
}

export default function draw_observer(context, observer) {
  const [v1, v2, v3] = observer.vision.vertices;

  context.translate(observer.position.x, observer.position.y);
  context.rotate(observer.angle);

  context.beginPath();
  context.fillStyle = "blue";
  context.moveTo(-observer.width / 2, -observer.height / 2);
  context.lineTo(observer.width / 2, 0);
  context.lineTo(-observer.width / 2, observer.height / 2);
  context.fill();
  context.setTransform(1, 0, 0, 1, 0, 0);

  context.beginPath();
  context.fillStyle = "#d5ff9499";
  context.moveTo(v1.x, v1.y);
  context.lineTo(v2.x, v2.y);
  context.lineTo(v3.x, v3.y);
  context.fill();
}

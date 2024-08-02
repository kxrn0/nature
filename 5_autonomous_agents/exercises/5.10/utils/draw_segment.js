export default function draw_segment(context, segment) {
  context.beginPath();
  context.moveTo(segment.start.x, segment.start.y);
  context.lineTo(segment.end.x, segment.end.y);
  context.stroke();
}

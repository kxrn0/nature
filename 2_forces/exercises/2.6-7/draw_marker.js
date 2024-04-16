export default function draw_marker(STATES, state, mouse, radius, context) {
  if (state === STATES.DRAGGING_BALLS) return;

  context.beginPath();
  context.strokeStyle = "black";
  context.arc(mouse.position.x, mouse.position.y, radius, 0, Math.PI * 2);
  context.stroke();
}

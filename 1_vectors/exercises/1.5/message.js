export default function message(text, background, color, canvas) {
  const context = canvas.getContext("2d");
  context.beginPath();
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "50px monospace";
  context.textAlign = "center";
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2, canvas.width);
}

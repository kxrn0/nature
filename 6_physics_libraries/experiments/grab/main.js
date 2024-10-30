const container = document.querySelector(".container");
const handle = container.querySelector(".handle");
const cornerOffset = { x: 0, y: 0 };
let isDragging = false;

handle.addEventListener("mousedown", (event) => {
  const containerRekt = container.getBoundingClientRect();
  const handleRekt = handle.getBoundingClientRect();

  cornerOffset.x = handleRekt.x - containerRekt.x;
  cornerOffset.y = handleRekt.y - containerRekt.y;

  isDragging = true;
});

handle.addEventListener("mouseup", () => (isDragging = false));

handle.addEventListener("mouseout", () => (isDragging = false));

window.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  const x = event.mouseX - cornerOffset.x;
  const xp = x / innerWidth;
  const y = event.mouseY - cornerOffset.y;
  const yp = y / innerHeight;

  container.style.setProperty("--x", `${xp}%`);
  container.style.setProperty("--y", `${yp}%`);
});

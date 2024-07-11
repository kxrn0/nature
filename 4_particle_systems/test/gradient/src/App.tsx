import { DefaultColorPicker } from "@thednp/solid-color-picker";
import "@thednp/solid-color-picker/style.css";
import { createSignal, onMount } from "solid-js";
import draw_radial_gradient from "./utils/draw_radial_gradient";
import find_luminance from "./utils/find_luminance";
import "./App.css";

function App() {
  const [size, setSize] = createSignal(100);
  const [center, setCenter] = createSignal({ x: 50, y: 50 });
  const [stop, setStop] = createSignal(90);
  const [color, setColor] = createSignal("rgb(200, 255, 220)");
  const [fillColor, setFillColor] = createSignal("black");
  let canvasRef!: HTMLCanvasElement;

  function draw() {
    if (!canvasRef) return;

    const context = canvasRef.getContext("2d")!;

    const radius = (size() * stop()) / 200;

    context.clearRect(0, 0, canvasRef.width, canvasRef.height);

    draw_radial_gradient(context, center(), radius, color());
  }

  function change_canvas_size(
    event: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    const size = Number(event.target.value);
    const center = { x: size / 2, y: size / 2 };

    setSize(size);
    setCenter(center);

    draw();
  }

  function change_stop(
    event: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    const stop = Number(event.target.value);

    setStop(stop);

    draw();
  }

  function change_color(color: string) {
    const luminance = find_luminance(color);
    const fillColor = luminance < 0.2 ? "white" : "black";

    setColor(color);
    setFillColor(fillColor);

    draw();
  }

  function download() {
    const a = document.createElement("a");
    const data = canvasRef.toDataURL();
    const name = `${Math.random().toString(16).slice(-10)}.png`;

    a.href = data;
    a.download = name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  onMount(() => draw());

  return (
    <div class="app">
      <form class="my-inputs">
        <label>
          <span>Canvas Size</span>
          <input
            type="range"
            min={25}
            max={1000}
            value={100}
            onInput={change_canvas_size}
          />
        </label>
        <label>
          <span>Stop</span>
          <input
            type="range"
            min={0}
            max={100}
            value={90}
            onInput={change_stop}
          />
        </label>
        <DefaultColorPicker value={color()} onChange={change_color} />
        <button type="button" class="download-button" onClick={download}>
          Download
        </button>
      </form>
      <canvas
        width={size()}
        height={size()}
        ref={canvasRef}
        style={{ background: fillColor() }}
      ></canvas>
    </div>
  );
}

export default App;

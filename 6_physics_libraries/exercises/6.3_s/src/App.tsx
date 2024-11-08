import { createSignal, onMount } from "solid-js";
import styles from "./App.module.scss";

function App() {
  let canvas!: HTMLCanvasElement;

  onMount(() => {
    const context = canvas.getContext("2d");

    function anime() {
      context?.clearRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(anime);
    }

    function init() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;

      if (!context) throw new Error("fuck!");

      requestAnimationFrame(anime);
    }

    init();
  });

  return (
    <div class={styles["app"]}>
      <canvas></canvas>
    </div>
  );
}

export default App;

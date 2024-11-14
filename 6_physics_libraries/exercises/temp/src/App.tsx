import { createSignal } from "solid-js";
import styles from "./App.module.scss";
import Factory from "./components/Factory/Factory";
import { createStore } from "solid-js/store";
import Matter from "matter-js";

function App() {
  const [shapes, setShapes] = createStore<Matter.Vector[][]>([]);

  function add_shape(shape: Matter.Vector[]) {
    setShapes(shapes.length, shape);
  }

  return (
    <div class={styles["app"]}>
      <Factory add_shape={(vs) => console.log(vs)} />
    </div>
  );
}

export default App;

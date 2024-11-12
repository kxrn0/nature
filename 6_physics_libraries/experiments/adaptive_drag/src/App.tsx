import { createStore } from "solid-js/store";
import styles from "./App.module.scss";
import Draggable from "./components/Draggable/Draggable";
import { For } from "solid-js";

function App() {
  const [widgets, setWidgets] = createStore([
    { id: 0, isOpen: false },
    { id: 1, isOpen: false },
    { id: 2, isOpen: false },
    { id: 3, isOpen: false },
    { id: 4, isOpen: false },
  ]);

  function toggle(id: number) {
    setWidgets(
      (w) => w.id === id,
      "isOpen",
      (prev) => !prev
    );
  }

  function remove(id: number) {
    setWidgets(widgets.filter((w) => w.id !== id));
  }

  return (
    <div class={styles["app"]}>
      <For each={widgets}>
        {(item, index) => (
          <Draggable
            initialPosition={{
              x: (innerWidth * index()) / widgets.length,
              y: (innerHeight * index()) / widgets.length,
            }}
            includeHandle={false}
          >
            <div class={styles["card"]}>
              <div class={styles["nav"]}>
                <span>hi</span>
                <div class={`handle ${styles["handle"]}`}></div>
                <button onClick={[toggle, item.id]}>
                  {item.isOpen ? "close" : "open"}
                </button>
                <button onClick={[remove, item.id]}>x</button>
              </div>
              <h1>Item No. {item.id}</h1>
              <div
                class={styles["content"]}
                classList={{ [styles["open"]]: item.isOpen }}
              >
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Suscipit, recusandae?
                </p>
              </div>
            </div>
          </Draggable>
        )}
      </For>
    </div>
  );
}

export default App;

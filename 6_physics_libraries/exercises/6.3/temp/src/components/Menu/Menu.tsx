import { createSignal, For, Show } from "solid-js";
import { Polygon } from "../../types";
import styles from "./Menu.module.scss";
import Draggable from "../Draggable/Draggable";
import Grab from "../../Icons/Grab";

type Props = {
  polygons: Polygon[];
  currentPolygon?: Polygon;
  set_polygon: (p: Polygon) => void;
  remove_polygon: (id: string) => void;
};

export default function Menu(props: Props) {
  const [isOpen, setIsOpen] = createSignal(true);

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  return (
    <Draggable initialPosition={{ x: 10, y: 10 }} includeHandle={false}>
      <div class={styles["menu"]}>
        <div class={styles["nav"]}>
          <div class="handle">
            <Grab />
          </div>
          <p class={styles["title"]}>Shapes</p>
          <Show when={props.currentPolygon}>
            <button onClick={toggle}>{isOpen() ? "close" : "open"}</button>
          </Show>
        </div>
        <div
          class={styles["content"]}
          classList={{ [styles["open"]]: isOpen() }}
        >
          <Show when={props.currentPolygon}>
            <div class={styles["preview"]}>
              <p>Preview</p>
              <div class={styles["image-container"]}>
                <img
                  src={props.currentPolygon?.original}
                  alt="current polygon"
                />
              </div>
            </div>
            <div class={styles["choices"]}>
              <p>Click to select</p>
              <div class={styles["list"]}>
                <For each={props.polygons}>
                  {(polygon) => (
                    <div
                      class={styles["choice"]}
                      classList={{
                        [styles["selected"]]:
                          props.currentPolygon?.id === polygon.id,
                      }}
                    >
                      <button
                        onClick={[props.remove_polygon, polygon.id]}
                        class={styles["delete"]}
                      >
                        x
                      </button>
                      <img
                        src={polygon.thumbnail}
                        alt="polygon choice"
                        onClick={[props.set_polygon, polygon]}
                      />
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </Draggable>
  );
}

import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Polygon } from "./types";
import Menu from "./components/Menu/Menu";
import Factory from "./components/Factory/Factory";
import styles from "./App.module.scss";
import World from "./components/World/World";

function App() {
  const [polygons, setPolygons] = createStore<Polygon[]>([]);
  const [currentPolygon, setCurrentPolygon] = createSignal<Polygon>();

  function add_polygon(polygon: Polygon) {
    setPolygons(polygons.length, polygon);

    if (!currentPolygon()) setCurrentPolygon(polygon);
  }

  function remove_polygon(id: string) {
    let index;

    index = -1;

    if (currentPolygon()?.id === id) {
      index = polygons.findIndex((p) => p.id === id);

      if (index !== -1)
        index = Math.max(0, Math.min(index, polygons.length - 2));
    }

    setPolygons(polygons.filter((p) => p.id !== id));

    if (index !== -1) setCurrentPolygon(polygons[index]);
  }

  return (
    <div class={styles["app"]}>
      <World currentPolygon={currentPolygon()} />
      <Menu
        polygons={polygons}
        currentPolygon={currentPolygon()}
        set_polygon={(p: Polygon) => setCurrentPolygon(p)}
        remove_polygon={remove_polygon}
      />
      <Factory add_polygon={add_polygon} />
    </div>
  );
}

export default App;

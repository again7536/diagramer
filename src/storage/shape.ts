import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { v4 as uuidv4 } from "uuid";
import { ShapeState } from "../types";

const shapeStore = () => {
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([]);
  const [selected, setSelected] = createSignal<SVGElement>();
  const [selectedShape, setSelectedShape] = createSignal<SVGElement>();

  return {
    shapeStates,
    selected,
    selectedShape,
    addShape(newState: ShapeState) {
      setShapeStates(produce((states) => states.push(newState)));
    },
    setShapeOf(idx: number, nextState: ShapeState) {
      setShapeStates(produce((states) => (states[idx] = nextState)));
    },
    setSelected,
    setSelectedShape,
  };
};

export { shapeStore };

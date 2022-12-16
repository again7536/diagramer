import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { v4 as uuidv4 } from "uuid";
import { ShapeState } from "../types";

const shapeStore = () => {
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([]);
  const [selectedElem, setSelectedElem] = createSignal<SVGElement>();
  const [idToIdx, setIdToIdx] = createSignal<{ [key: string]: number }>({});
  const [selectedShapeIds, setSelectedShapeIds] = createStore<string[]>([]);

  return {
    shapeStates,
    selectedElem,
    selectedShapeIds,
    addShape(newState: ShapeState) {
      setIdToIdx((prev) => ({ ...prev, [newState.id]: shapeStates.length }));
      setShapeStates(produce((states) => states.push(newState)));
    },
    getShapeState(id: string) {
      return shapeStates[idToIdx()[id]];
    },
    setShapeOf(id: string, nextState: ShapeState) {
      setShapeStates(produce((states) => (states[idToIdx()[id]] = nextState)));
    },
    setSelectedElem,
    setSelectedShapeIds,
  };
};

export { shapeStore };

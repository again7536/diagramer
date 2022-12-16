import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RESIZE_CIRCLE_CONFIG, LINE_RESIZE_CIRCLE_CONFIG } from "../constants";
import { ShapeState } from "../types";
import { calcShapeState } from "../utils/calcShapeState";

const shapeStore = () => {
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([]);
  const [selectedElem, setSelectedElem] = createSignal<SVGElement>();
  const [idToIdx, setIdToIdx] = createSignal<{ [key: string]: number }>({});
  const [selectedShapeIds, setSelectedShapeIds] = createStore<string[]>([]);

  const addShape = (newState: ShapeState) => {
    setIdToIdx((prev) => ({ ...prev, [newState.id]: shapeStates.length }));
    setShapeStates(produce((states) => states.push(newState)));
  };
  const getShapeState = (id: string) => {
    return shapeStates[idToIdx()[id]];
  };
  const setShapeOf = (id: string, nextState: ShapeState) => {
    setShapeStates(produce((states) => (states[idToIdx()[id]] = nextState)));
  };
  const resizeShapes = ({ diffX, diffY }: { diffX: number; diffY: number }) => {
    const $selectedElem = selectedElem() as SVGElement;
    const resizerIdx = +$selectedElem.classList[0].split("-")[1];
    selectedShapeIds
      .filter((id) => getShapeState(id).type !== "line")
      .forEach((id) => {
        const state = getShapeState(id);
        setShapeOf(id, {
          ...state,
          cur: {
            ...calcShapeState({
              ...RESIZE_CIRCLE_CONFIG[resizerIdx].resize,
              ...state.prev,
              diffX,
              diffY,
            }),
          },
        });
      });
    selectedShapeIds
      .filter((id) => getShapeState(id).type === "line")
      .forEach((id) => {
        const state = getShapeState(id);
        setShapeOf(id, {
          ...state,
          cur: {
            ...calcShapeState({
              ...LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize,
              ...state.prev,
              diffX,
              diffY,
            }),
          },
        });
      });
  };

  const moveShapes = ({ diffX, diffY }: { diffX: number; diffY: number }) => {
    selectedShapeIds
      .filter((id) => getShapeState(id).type !== "line")
      .forEach((id) => {
        const state = getShapeState(id);
        setShapeOf(id, {
          ...state,
          cur: {
            ...state.cur,
            x: diffX + state.prev.x,
            y: diffY + state.prev.y,
          },
        });
      });
    selectedShapeIds
      .filter((id) => getShapeState(id).type === "line")
      .forEach((id) => {
        const state = getShapeState(id);
        setShapeOf(id, {
          ...state,
          cur: {
            x: diffX + state.prev.x,
            y: diffY + state.prev.y,
            width: diffX + state.prev.width,
            height: diffY + state.prev.height,
          },
        });
      });
  };

  return {
    shapeStates,
    selectedElem,
    selectedShapeIds,
    addShape,
    getShapeState,
    setShapeOf,
    resizeShapes,
    moveShapes,
    setSelectedElem,
    setSelectedShapeIds,
  };
};

export { shapeStore };

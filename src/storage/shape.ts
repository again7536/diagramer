import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RESIZE_CIRCLE_CONFIG, LINE_RESIZE_CIRCLE_CONFIG } from "../constants";
import { ShapeState } from "../types";
import { calcShapeState } from "../utils/calcShapeState";
import { snapLine } from "../utils/calcSnap";

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
    const idx = idToIdx()[id];
    return typeof idx === "number" ? shapeStates[idx] : null;
  };

  const setShapeOf = (id: string, nextState: ShapeState) => {
    setShapeStates(produce((states) => (states[idToIdx()[id]] = nextState)));
  };

  const resizeShapes = ({ diffX, diffY }: { diffX: number; diffY: number }) => {
    const $selectedElem = selectedElem() as SVGElement;
    const resizerIdx = +$selectedElem.classList[0].split("-")[1];
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type !== "line")
      .forEach((id) => {
        const state = getShapeState(id);
        state &&
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
      .filter((id) => getShapeState(id)?.type === "line")
      .forEach((id, _, arr) => {
        const state = getShapeState(id);
        if (!state) return;

        const isXMoved = LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.dx > 0;
        const nextDim = calcShapeState({
          ...LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize,
          ...state.prev,
          diffX,
          diffY,
        });

        // line snap
        if (arr.length === 1) {
          const intersections = shapeStates
            .filter((state) => state.id !== $selectedElem.id)
            .reduce((acc: null | { x: number; y: number }[], state) => {
              if (acc) return acc;
              return snapLine({
                shape: { ...state.cur },
                shapeType: state.type,
                path: { ...nextDim },
                isXMoved,
              });
            }, null);
          if (intersections?.[0]) {
            setShapeOf(id, {
              ...state,
              cur: isXMoved
                ? { ...state.cur, ...intersections[0] }
                : {
                    ...state.cur,
                    width: intersections[0].x,
                    height: intersections[0].y,
                  },
            });
            return;
          }
        }

        setShapeOf(id, {
          ...state,
          cur: nextDim,
        });
      });
  };

  const moveShapes = ({ diffX, diffY }: { diffX: number; diffY: number }) => {
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type !== "line")
      .forEach((id) => {
        const state = getShapeState(id);
        state &&
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
      .filter((id) => getShapeState(id)?.type === "line")
      .forEach((id) => {
        const state = getShapeState(id);
        state &&
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

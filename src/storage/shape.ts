import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RESIZE_CIRCLE_CONFIG, LINE_RESIZE_CIRCLE_CONFIG } from "../constants";
import { ShapeState } from "../types";
import { calcMove, calcLineResize, calcShapeResize } from "../utils/calcShape";
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

  const resizeShapes = (diff: { x: number; y: number }) => {
    const $selectedElem = selectedElem() as SVGElement;
    const resizerIdx = +$selectedElem.classList[0].split("-")[1];

    // shape resize
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type !== "line")
      .forEach((id) => {
        const state = getShapeState(id);
        if (!state) return;

        // const $shape = getShapeElem(state.id);
        // state.snapped.forEach((snap) => {
        //   const $snap = getShapeElem(snap);
        // });

        setShapeOf(id, {
          ...state,
          cur: calcShapeResize({
            ...state.prev,
            diff: { ...diff },
            dir: { ...RESIZE_CIRCLE_CONFIG[resizerIdx].resize },
          }),
        });
      });

    // line resize
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type === "line")
      .forEach((id, _, arr) => {
        const state = getShapeState(id);
        if (!state) return;

        const isXMoved = LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.p1.x > 0;
        const nextDim = calcLineResize({
          ...state.prev,
          diff: { ...diff },
          dir: { ...LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize },
        });

        // line snap start
        if (arr.length === 1) {
          const intersections = shapeStates
            .filter((state) => state.id !== $selectedElem.id)
            .reduce(
              (acc: null | { x: number; y: number }[], state) =>
                acc
                  ? acc
                  : snapLine({
                      shape: { ...state.cur },
                      shapeType: state.type,
                      path: { ...nextDim },
                      isXMoved,
                    }),
              null
            );
          if (intersections?.[0]) {
            setShapeOf(id, {
              ...state,
              cur: isXMoved
                ? { ...state.cur, p1: { ...intersections[0] } }
                : { ...state.cur, p2: { ...intersections[0] } },
            });
            return;
          }
        }
        // line snap end

        setShapeOf(id, {
          ...state,
          cur: nextDim,
        });
      });
  };

  const moveShapes = (diff: { x: number; y: number }) => {
    // shape translation
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type !== "line")
      .forEach((id) => {
        const state = getShapeState(id);
        state &&
          setShapeOf(id, {
            ...state,
            cur: { ...calcMove({ ...state.prev, diff: { ...diff } }) },
          });
      });

    // line translation
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type === "line")
      .forEach((id) => {
        const state = getShapeState(id);
        state &&
          setShapeOf(id, {
            ...state,
            cur: { ...calcMove({ ...state.prev, diff: { ...diff } }) },
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

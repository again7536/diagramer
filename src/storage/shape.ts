import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RESIZE_CIRCLE_CONFIG, LINE_RESIZE_CIRCLE_CONFIG } from "../constants";
import { ShapeState } from "../types";
import immer from "immer";
import {
  calcMove,
  calcLineResize,
  calcShapeResize,
  snapLine,
  applyResizeToPoint,
} from "../utils";

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

        const nextDim = calcShapeResize({
          ...state.prev,
          diff: { ...diff },
          dir: { ...RESIZE_CIRCLE_CONFIG[resizerIdx].resize },
        });

        // resize snapped line start
        Object.entries(state.snapped).forEach(([snapId, snapResizerIdx]) => {
          const snapState = getShapeState(snapId);
          if (!snapState) return;

          const isP1 = snapResizerIdx === 0;
          const resizedPoint = applyResizeToPoint({
            ...state,
            point: isP1 ? snapState.prev.p1 : snapState.prev.p2,
          });
          setShapeOf(
            snapId,
            immer(snapState, (draft) => {
              if (isP1) draft.cur.p1 = resizedPoint;
              else draft.cur.p2 = resizedPoint;
            })
          );
        });
        // resize snapped line end

        setShapeOf(id, {
          ...state,
          cur: nextDim,
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
              (
                acc: null | { id: string; points: { x: number; y: number }[] },
                state
              ) => {
                if (acc) return acc;

                const result = snapLine({
                  shape: { ...state.cur },
                  shapeType: state.type,
                  path: { ...nextDim },
                  isXMoved,
                });
                return result.length > 0
                  ? { id: state.id, points: result }
                  : null;
              },
              null
            );
          if (intersections?.points?.[0]) {
            setShapeOf(
              id,
              immer(state, (draft) => {
                draft.cur = isXMoved
                  ? { ...draft.cur, p1: { ...intersections.points[0] } }
                  : { ...draft.cur, p2: { ...intersections.points[0] } };
              })
            );
            const snapperState = getShapeState(intersections.id);
            if (!snapperState) return;

            setShapeOf(intersections.id, {
              ...snapperState,
              snapped: {
                ...snapperState.snapped,
                [state.id]: resizerIdx,
              },
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
        if (!state) return;

        // move snapped line start
        Object.entries(state.snapped).forEach(([snapId, snapResizerIdx]) => {
          const snapState = getShapeState(snapId);
          if (!snapState) return;

          const isP1 = snapResizerIdx === 0;
          setShapeOf(
            snapId,
            immer(snapState, (draft) => {
              const moved = calcMove({ ...snapState.prev, diff: { ...diff } });
              if (isP1) draft.cur.p1 = moved.p1;
              else draft.cur.p2 = moved.p2;
            })
          );
        });
        // move snapped line end

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

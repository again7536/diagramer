import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RESIZE_CIRCLE_CONFIG } from "../constants";
import { ShapeState, Snap } from "../types";
import immer from "immer";
import { merge } from "lodash";
import {
  calcMove,
  calcShapeResize,
  applyResizeToPoint,
  getResizedLineState,
} from "../utils";

const shapeStore = () => {
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([]);
  const [snaps, setSnaps] = createStore<Snap>({});
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
    const resizerIdx = +(selectedElem() as SVGElement).classList[0].split(
      "-"
    )[1];

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
        Object.entries(snaps[id]?.snapped ?? {}).forEach(
          ([snapId, snapResizerIdx]) => {
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
          }
        );
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
        const lineState = getShapeState(id);
        if (!lineState) return;

        const { nextDim, intersections, isP1Moved } = getResizedLineState({
          shapeStates,
          lineState,
          resizerIdx,
          diff,
          isSnap: arr.length === 1,
        });

        if (!intersections?.points?.[0]) {
          setShapeOf(id, {
            ...lineState,
            cur: nextDim,
          });
          return;
        }

        setShapeOf(
          id,
          immer(lineState, (draft) => {
            draft.cur = isP1Moved
              ? { ...draft.cur, p1: { ...intersections.points[0] } }
              : { ...draft.cur, p2: { ...intersections.points[0] } };
          })
        );
        setSnaps(
          produce((draft) => {
            const snappedState = getShapeState(intersections.id);
            if (!snappedState) return;

            const prevSnappedId = draft[lineState.id]?.snapping?.[resizerIdx];
            if (prevSnappedId)
              delete draft[prevSnappedId]?.snapped[lineState.id];
            merge(draft, {
              [snappedState.id]: {
                snapped: { [lineState.id]: resizerIdx },
              },
              [lineState.id]: {
                snapping: { [resizerIdx]: snappedState.id },
              },
            });
          })
        );
      });
  };

  const moveShapes = (diff: { x: number; y: number }) => {
    // shape translation
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type !== "line")
      .forEach((id) => {
        const shapeState = getShapeState(id);
        if (!shapeState) return;

        // move snapped line start
        Object.entries(snaps[id]?.snapped ?? {}).forEach(
          ([snapId, snapResizerIdx]) => {
            const snapState = getShapeState(snapId);
            if (!snapState) return;

            const isP1 = snapResizerIdx === 0;
            setShapeOf(
              snapId,
              immer(snapState, (draft) => {
                const moved = calcMove({
                  ...snapState.prev,
                  diff: { ...diff },
                });
                if (isP1) draft.cur.p1 = moved.p1;
                else draft.cur.p2 = moved.p2;
              })
            );
          }
        );
        // move snapped line end

        setShapeOf(id, {
          ...shapeState,
          cur: { ...calcMove({ ...shapeState.prev, diff: { ...diff } }) },
        });
      });

    // line translation
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type === "line")
      .forEach((id) => {
        const lineState = getShapeState(id);
        lineState &&
          setShapeOf(id, {
            ...lineState,
            cur: { ...calcMove({ ...lineState.prev, diff: { ...diff } }) },
          });
      });
  };

  const confirmShapes = () => {
    selectedShapeIds.forEach((id) => {
      const state = getShapeState(id);
      if (!state) return;

      // confirm snapped line start
      Object.keys(snaps[id]?.snapped ?? {}).forEach((snapId) => {
        const snapState = getShapeState(snapId);
        if (!snapState) return;
        setShapeOf(snapId, {
          ...snapState,
          prev: {
            ...snapState.cur,
          },
        });
      });
      // confirm snapped line end

      setShapeOf(id, {
        ...state,
        prev: {
          ...state.cur,
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
    confirmShapes,
    setSelectedElem,
    setSelectedShapeIds,
  };
};

export { shapeStore };

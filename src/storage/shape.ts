import { batch, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  RESIZE_CIRCLE_CONFIG,
  TREE_ROOT,
  TREE_ROOT_ID,
  TREE_ROOT_IDX,
} from "../constants";
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
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([
    { ...TREE_ROOT },
  ]);
  const [idToIdx, setIdToIdx] = createSignal<{ [key: string]: number }>({
    [TREE_ROOT_ID]: TREE_ROOT_IDX,
  });
  const [snaps, setSnaps] = createStore<Snap>({});
  const [selectedElem, setSelectedElem] = createSignal<SVGElement>();
  const [selectedShapeIds, setSelectedShapeIds] = createStore<string[]>([]);

  const getShapeState = (id: string) => {
    const idx = idToIdx()[id];
    if (typeof idx !== "number") throw new Error("Invalid id");
    return shapeStates[idx];
  };

  const addShape = (newState: ShapeState) => {
    batch(() => {
      setIdToIdx((prev) => ({ ...prev, [newState.id]: shapeStates.length }));
      setShapeStates(produce((states) => states.push(newState)));
      setShapeStates(
        produce((states) =>
          states[TREE_ROOT_IDX].children.push(() => getShapeState(newState.id))
        )
      );
    });
  };

  const reorderTo = ({
    origId,
    targetId,
    next,
  }: {
    origId: string;
    targetId: string;
    next?: boolean;
  }) => {
    batch(() => {
      const origParentState = getShapeState(origId).parent?.();
      const parentState = getShapeState(targetId).parent?.();
      if (!origParentState || !parentState) return;

      const origIdx = origParentState.children.findIndex(
        (childId) => childId().id === origId
      );
      const targetIdx = parentState.children.findIndex(
        (childId) => childId().id === targetId
      );

      setShapeOf(
        parentState.id,
        immer(parentState, (draft) => {
          draft.children.splice(targetIdx + (next ? 1 : 0), 0, () =>
            getShapeState(origId)
          );
        })
      );
      setShapeOf(
        origParentState.id,
        immer(origParentState, (draft) => {
          draft.children.splice(origIdx, 1);
        })
      );
      setShapeOf(
        origId,
        immer(getShapeState(origId), (draft) => {
          draft.parent = () => getShapeState(parentState.id);
        })
      );
    });
  };

  const setShapeOf = (id: string, nextState: ShapeState) => {
    setShapeStates(produce((states) => (states[idToIdx()[id]] = nextState)));
  };

  const resizeShapes = (diff: { x: number; y: number }) => {
    batch(() => {
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
    });
  };

  const moveShapes = (diff: { x: number; y: number }) => {
    batch(() => {
      // shape translation
      selectedShapeIds
        .filter((id) => getShapeState(id)?.type !== "line")
        .forEach((id) => {
          const shapeState = getShapeState(id);

          // move snapped line start
          Object.entries(snaps[id]?.snapped ?? {}).forEach(
            ([snapId, snapResizerIdx]) => {
              const snapState = getShapeState(snapId);
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
    reorderTo,
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

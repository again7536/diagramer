import { batch, createSignal } from "solid-js";
import { createStore, produce, unwrap } from "solid-js/store";
import {
  RESIZE_CIRCLE_CONFIG,
  TREE_ROOT,
  TREE_ROOT_ID,
  TREE_ROOT_IDX,
} from "../constants";
import { ShapeState } from "../types";
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
  const [selectedElem, setSelectedElem] = createSignal<SVGElement>();
  const [selectedShapeIds, setSelectedShapeIds] = createStore<string[]>([]);

  const getShapeState = (id: string) => {
    const idx = idToIdx()[id];
    if (typeof idx !== "number") throw new Error("Invalid id");
    return shapeStates[idx];
  };

  const setShapeOf = (
    id: string,
    next: ShapeState | ((prev: ShapeState) => ShapeState)
  ) => {
    const nextState =
      typeof next === "function" ? next(getShapeState(id)) : next;
    setShapeStates(produce((states) => (states[idToIdx()[id]] = nextState)));
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
    const origParentState = getShapeState(origId).parent?.();
    const parentState = getShapeState(targetId).parent?.();
    if (!origParentState || !parentState) return;

    const origIdx = origParentState.children.findIndex(
      (childId) => childId().id === origId
    );
    const targetIdx = parentState.children.findIndex(
      (childId) => childId().id === targetId
    );

    setShapeStates(
      produce((draft) => {
        draft[idToIdx()[parentState.id]].children.splice(
          targetIdx + (next ? 1 : 0),
          0,
          () => getShapeState(origId)
        );
        draft[idToIdx()[origParentState.id]].children.splice(origIdx, 1);
        draft[idToIdx()[origId]].parent = () => getShapeState(parentState.id);
      })
    );
  };

  const resizeShapes = (diff: { x: number; y: number }) => {
    const resizerIdx = +(selectedElem() as SVGElement).classList[0].split(
      "-"
    )[1];

    // shape resize
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type !== "line")
      .forEach((id) => {
        const shapeState = getShapeState(id);
        const nextDim = calcShapeResize({
          ...shapeState.prev,
          diff: { ...diff },
          dir: { ...RESIZE_CIRCLE_CONFIG[resizerIdx].resize },
        });

        batch(() => {
          console.log(shapeState.snapped);
          // resize snapped line start
          Object.entries(shapeState.snapped).forEach(
            ([snapId, snapResizerIdx]) => {
              const snapState = getShapeState(snapId);
              const isP1 = snapResizerIdx === 0;
              const resizedPoint = applyResizeToPoint({
                ...shapeState,
                point: isP1 ? snapState.prev.p1 : snapState.prev.p2,
              });
              setShapeStates(
                produce((draft) => {
                  if (isP1) draft[idToIdx()[snapId]].cur.p1 = resizedPoint;
                  else draft[idToIdx()[snapId]].cur.p2 = resizedPoint;
                })
              );
            }
          );
          // resize snapped line end

          setShapeOf(id, {
            ...shapeState,
            cur: nextDim,
          });
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

        // line snap
        setShapeStates(
          produce((draft) => {
            merge(
              draft[idToIdx()[id]].cur,
              isP1Moved
                ? { p1: { ...intersections.points[0] } }
                : { p2: { ...intersections.points[0] } }
            );
            const prevSnappedId = draft[idToIdx()[id]].snapping[resizerIdx];
            if (prevSnappedId)
              delete draft[idToIdx()[prevSnappedId]].snapped[id];
            merge(draft[idToIdx()[id]].snapping, {
              [resizerIdx]: intersections.id,
            });
            merge(draft[idToIdx()[intersections.id]].snapped, {
              [id]: resizerIdx,
            });
          })
        );
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
          Object.entries(shapeState.snapped).forEach(
            ([snapId, snapResizerIdx]) =>
              setShapeStates(
                produce((draft) => {
                  const moved = calcMove({
                    ...getShapeState(snapId).prev,
                    diff: { ...diff },
                  });
                  if (snapResizerIdx === 0)
                    draft[idToIdx()[snapId]].cur.p1 = moved.p1;
                  else draft[idToIdx()[snapId]].cur.p2 = moved.p2;
                })
              )
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
    batch(() => {
      selectedShapeIds.forEach((id) => {
        const shapeState = getShapeState(id);

        // confirm snapped line start
        Object.keys(shapeState.snapped).forEach((snapId) => {
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
          ...shapeState,
          prev: {
            ...shapeState.cur,
          },
        });
      });
    });
  };

  return {
    shapeStates,
    selectedElem,
    selectedShapeIds,
    reorderTo,
    addShape,
    setShapeOf,
    getShapeState,
    resizeShapes,
    moveShapes,
    confirmShapes,
    setSelectedElem,
    setSelectedShapeIds,
  };
};

export { shapeStore };

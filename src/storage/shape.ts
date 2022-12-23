import { batch, createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  DIR,
  LINE_RESIZE_CIRCLE_CONFIG,
  RESIZE_CIRCLE_CONFIG,
  TREE_ROOT,
  TREE_ROOT_ID,
  TREE_ROOT_IDX,
} from "../constants";
import { ShapeState } from "../types";
import { merge } from "lodash";
import {
  scaleByOffset,
  getSnapped,
  getMatrixFromPoints,
  getPointsFromMatrix,
} from "../utils";
import {
  applyToPoint,
  compose,
  inverse,
  Matrix,
  transform,
  translate,
} from "transformation-matrix";

const shapeStore = () => {
  const [shapeStates, setShapeStates] = createStore<ShapeState[]>([
    { ...TREE_ROOT },
  ]);
  const [idToIdx, setIdToIdx] = createSignal<{ [key: string]: number }>({
    [TREE_ROOT_ID]: TREE_ROOT_IDX,
  });
  const [selectedElem, setSelectedElem] = createSignal<SVGElement>();
  const [selectedShapeIds, setSelectedShapeIds] = createStore<string[]>([]);

  const _calcSnappedLine = (shapeState: ShapeState, mat: Matrix) => {
    Object.entries(shapeState.snapped).forEach(([snapId, snapResizerIdx]) => {
      const snapState = getShapeState(snapId);
      const isLeftTop = snapResizerIdx === 0;
      const resizedPoint = applyToPoint(
        mat,
        applyToPoint(
          inverse(shapeState.prev),
          isLeftTop
            ? getPointsFromMatrix(snapState.prev).p1
            : getPointsFromMatrix(snapState.prev).p2
        )
      );

      setShapeStates(
        produce((draft) => {
          draft[idToIdx()[snapId]].cur = getMatrixFromPoints(
            isLeftTop
              ? {
                  ...getPointsFromMatrix(snapState.prev),
                  p1: resizedPoint,
                }
              : {
                  ...getPointsFromMatrix(snapState.prev),
                  p2: resizedPoint,
                }
          );
        })
      );
    });
  };

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
        const mat = scaleByOffset({
          mat: shapeState.prev,
          sx: (diff.x * RESIZE_CIRCLE_CONFIG[resizerIdx].resize.to.x) / 2,
          sy: (diff.y * RESIZE_CIRCLE_CONFIG[resizerIdx].resize.to.y) / 2,
          cx: RESIZE_CIRCLE_CONFIG[resizerIdx].resize.origin.x,
          cy: RESIZE_CIRCLE_CONFIG[resizerIdx].resize.origin.y,
        });

        batch(() => {
          _calcSnappedLine(shapeState, mat);
          setShapeOf(id, {
            ...shapeState,
            cur: mat,
          });
        });
      });

    // line resize
    selectedShapeIds
      .filter((id) => getShapeState(id)?.type === "line")
      .forEach((id) => {
        const lineState = getShapeState(id);
        const { nextMat, intersections } = getSnapped({
          shapeStates,
          lineState,
          resizerIdx,
          diff,
          isSnap: selectedShapeIds.length === 1,
        });

        if (!intersections?.points?.[0]) {
          setShapeOf(id, {
            ...lineState,
            cur: nextMat,
          });
          return;
        }

        // line snap
        setShapeStates(
          produce((draft) => {
            const isLeftTop =
              LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.to.x < 0;
            const points = isLeftTop
              ? {
                  ...getPointsFromMatrix(lineState.prev),
                  p1: intersections.points[0],
                }
              : {
                  ...getPointsFromMatrix(lineState.prev),
                  p2: intersections.points[0],
                };
            const snappedMat = getMatrixFromPoints(points);
            const prevSnappedId = draft[idToIdx()[id]].snapping[resizerIdx];

            draft[idToIdx()[id]].cur = snappedMat;
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
          const mat = transform(translate(diff.x, diff.y), shapeState.prev);

          _calcSnappedLine(shapeState, mat);
          setShapeOf(id, {
            ...shapeState,
            cur: mat,
          });
        });

      // line translation
      selectedShapeIds
        .filter((id) => getShapeState(id)?.type === "line")
        .forEach((id) => {
          const lineState = getShapeState(id);
          const mat = transform(translate(diff.x, diff.y), lineState.prev);
          setShapeOf(id, {
            ...lineState,
            cur: mat,
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

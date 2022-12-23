import { LINE_RESIZE_CIRCLE_CONFIG, TREE_ROOT_ID } from "../constants";
import { ShapeState } from "../types";
import { getPointsFromMatrix, scaleByOffset } from "./calcMatrix";
import { getLineIntersection } from "./intersection";

interface ResizeLineParams {
  shapeStates: ShapeState[];
  lineState: ShapeState;
  resizerIdx: number;
  diff: { x: number; y: number };
  isSnap: boolean;
}

const getSnapped = ({
  shapeStates,
  lineState,
  diff,
  resizerIdx,
  isSnap,
}: ResizeLineParams) => {
  const isLeftTop = LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.to.x < 0;
  const mat = scaleByOffset({
    mat: lineState.prev,
    sx: (diff.x * LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.to.x) / 2,
    sy: (diff.y * LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.to.y) / 2,
    cx: LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.origin.x,
    cy: LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.origin.y,
  });

  if (isSnap) {
    const intersections = shapeStates
      .filter(
        (shapeState) =>
          lineState.id !== shapeState.id && shapeState.id !== TREE_ROOT_ID
      )
      .reduce(
        (
          acc: null | { id: string; points: { x: number; y: number }[] },
          shapeState
        ) => {
          if (acc) return acc;
          const result = getLineIntersection({
            shape: getPointsFromMatrix(shapeState.cur),
            shapeType: shapeState.type,
            path: getPointsFromMatrix(mat),
            isLeftTop,
          });

          return result.length > 0
            ? { id: shapeState.id, points: result }
            : null;
        },
        null
      );
    return { nextMat: mat, intersections };
  }
  return { nextMat: mat, intersections: null };
};

export { getSnapped };

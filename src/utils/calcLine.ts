import immer from "immer";
import { LINE_RESIZE_CIRCLE_CONFIG } from "../constants";
import { Area, ShapeState } from "../types";
import { pointAdd, pointMul } from "./calcPoint";
import { snapLine } from "./calcSnap";

interface CalcResizeParams extends Area {
  diff: { x: number; y: number };
  dir: Area;
}

const calcLineResize = ({ p1, p2, diff, dir }: CalcResizeParams) => {
  let { x: nextX1, y: nextY1 } = pointAdd({
    p1: pointMul({ p1: dir.p1, p2: diff }),
    p2: p1,
  });
  let { x: nextX2, y: nextY2 } = pointAdd({
    p1: pointMul({ p1: dir.p2, p2: diff }),
    p2: p2,
  });

  return { p1: { x: nextX1, y: nextY1 }, p2: { x: nextX2, y: nextY2 } };
};

interface ResizeLineParams {
  shapeStates: ShapeState[];
  lineState: ShapeState;
  resizerIdx: number;
  diff: { x: number; y: number };
  isSnap: boolean;
}

const getResizedLineState = ({
  shapeStates,
  lineState,
  diff,
  resizerIdx,
  isSnap,
}: ResizeLineParams) => {
  const isP1Moved = LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize.p1.x > 0;
  const nextDim = calcLineResize({
    ...lineState.prev,
    diff: { ...diff },
    dir: { ...LINE_RESIZE_CIRCLE_CONFIG[resizerIdx].resize },
  });

  if (isSnap) {
    const intersections = shapeStates
      .filter((shapeState) => lineState.id !== shapeState.id)
      .reduce(
        (
          acc: null | { id: string; points: { x: number; y: number }[] },
          shapeState
        ) => {
          if (acc) return acc;

          const result = snapLine({
            shape: { ...shapeState.cur },
            shapeType: shapeState.type,
            path: { ...nextDim },
            isXMoved: isP1Moved,
          });
          return result.length > 0
            ? { id: shapeState.id, points: result }
            : null;
        },
        null
      );
    return { nextDim, intersections, isP1Moved };
  }
  return { nextDim, intersections: null, isP1Moved };
};

export { calcLineResize, getResizedLineState };

import { applyToPoint, Matrix } from "transformation-matrix";
import { DIR } from "../constants";
import { Area } from "../types";
import { pointAdd, pointMul } from "./calcPoint";

interface CalcResizeParams extends Area {
  diff: { x: number; y: number };
  dir: Area;
}

interface CalcMoveParams extends Area {
  diff: { x: number; y: number };
}

const calcShapeResize = ({ p1, p2, diff, dir }: CalcResizeParams) => {
  let { x: nextX1, y: nextY1 } = pointAdd({
    p1: pointMul({ p1: dir.p1, p2: diff }),
    p2: p1,
  });
  let { x: nextX2, y: nextY2 } = pointAdd({
    p1: pointMul({ p1: dir.p2, p2: diff }),
    p2: p2,
  });

  if (nextX2 < nextX1) {
    const temp = nextX2;
    nextX2 = nextX1;
    nextX1 = temp;
  }
  if (nextY2 < nextY1) {
    const temp = nextY2;
    nextY2 = nextY1;
    nextY1 = temp;
  }
  return { p1: { x: nextX1, y: nextY1 }, p2: { x: nextX2, y: nextY2 } };
};

const calcMove = ({ p1, p2, diff }: CalcMoveParams) => {
  return {
    p1: pointAdd({ p1: p1, p2: diff }),
    p2: pointAdd({ p1: p2, p2: diff }),
  };
};

export { calcShapeResize, calcMove };

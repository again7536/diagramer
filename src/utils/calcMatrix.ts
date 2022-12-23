import {
  Matrix,
  transform,
  scale,
  applyToPoint,
  compose,
  translate,
} from "transformation-matrix";
import { DIR } from "../constants";
import { Area } from "../types";

interface ScaleByOffsetParams {
  mat: Matrix;
  sx: number;
  sy: number;
  cx?: number;
  cy?: number;
}

function scaleByOffset({ mat, sx, sy, cx, cy }: ScaleByOffsetParams) {
  return transform(mat, scale(1 + sx / mat.a, 1 + sy / mat.d, cx, cy));
}
const getPointsFromMatrix = (lineMatrix: Matrix) => {
  return {
    p1: applyToPoint(lineMatrix, DIR.TOP_LEFT),
    p2: applyToPoint(lineMatrix, DIR.BOTTOM_RIGHT),
  };
};

const getMatrixFromPoints = (points: Area) => {
  return compose(
    translate(points.p1.x + 1, points.p1.y + 1),
    scale(
      (points.p2.x - points.p1.x) / 2,
      (points.p2.y - points.p1.y) / 2,
      DIR.TOP_LEFT.x,
      DIR.TOP_LEFT.y
    )
  );
};

export { scaleByOffset, getPointsFromMatrix, getMatrixFromPoints };

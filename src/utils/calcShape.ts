import { Area } from "../types";

interface CalcRatioParams extends Area {
  p3: { x: number; y: number };
}

interface ApplyResizeToPointParams {
  prev: Area;
  cur: Area;
  point: { x: number; y: number };
}

interface CalcResizeParams extends Area {
  diff: { x: number; y: number };
  dir: Area;
}

interface CalcMoveParams extends Area {
  diff: { x: number; y: number };
}

// Calculate relative position of p3 comparing p1, p2
const _calcRelativeRatio = ({ p1, p2, p3 }: CalcRatioParams) => {
  const { w, h } = getWidthHeight({ p1, p2 });
  const { x: dx, y: dy } = pointSub({ p1: p3, p2: p1 });
  return { x: dx / w, y: dy / h };
};

const applyResizeToPoint = ({ cur, prev, point }: ApplyResizeToPointParams) => {
  const ratio = _calcRelativeRatio({ ...prev, p3: point });
  const relPos = pointMul({
    p1: pointSub({ p1: cur.p2, p2: cur.p1 }),
    p2: ratio,
  });
  return pointAdd({ p1: cur.p1, p2: relPos });
};

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

const calcMove = ({ p1, p2, diff }: CalcMoveParams) => {
  return {
    p1: pointAdd({ p1: p1, p2: diff }),
    p2: pointAdd({ p1: p2, p2: diff }),
  };
};

function pointSub({ p1, p2 }: Area) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}
function pointAdd({ p1, p2 }: Area) {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}
function pointMul({ p1, p2 }: Area) {
  return { x: p1.x * p2.x, y: p1.y * p2.y };
}

function getWidthHeight(area: Area) {
  return { w: area.p2.x - area.p1.x, h: area.p2.y - area.p1.y };
}
function getCenterPoint(area: Area) {
  return { x: (area.p1.x + area.p2.x) / 2, y: (area.p1.y + area.p2.y) / 2 };
}

export {
  applyResizeToPoint,
  calcShapeResize,
  calcLineResize,
  calcMove,
  pointSub,
  pointAdd,
  pointMul,
  getCenterPoint,
  getWidthHeight,
};

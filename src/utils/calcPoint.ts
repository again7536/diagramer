import { Area } from "../types";

function pointSub({ p1, p2 }: Area) {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}
function pointAdd({ p1, p2 }: Area) {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}
function pointMul({ p1, p2 }: Area) {
  return { x: p1.x * p2.x, y: p1.y * p2.y };
}
function pointDiv({ p1, p2 }: Area) {
  return { x: p1.x / p2.x, y: p1.y / p2.y };
}

function isPointInArea(point: { x: number; y: number }, area: Area) {
  return (
    point.x > area.p1.x &&
    point.x < area.p2.x &&
    point.y > area.p1.y &&
    point.y < area.p2.y
  );
}

function getWidthHeight(area: Area) {
  return { w: area.p2.x - area.p1.x, h: area.p2.y - area.p1.y };
}
function getCenterPoint(area: Area) {
  return { x: (area.p1.x + area.p2.x) / 2, y: (area.p1.y + area.p2.y) / 2 };
}

export {
  pointSub,
  pointAdd,
  pointMul,
  pointDiv,
  isPointInArea,
  getWidthHeight,
  getCenterPoint,
};

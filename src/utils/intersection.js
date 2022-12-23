import { ShapeInfo, Intersection } from "kld-intersections";
import { SHAPE_TYPES } from "../constants";
import { getCenterPoint, getWidthHeight } from "./calcPoint";

const SNAP_LENGTH = 30;

function getLineIntersection({ shape, shapeType, isLeftTop, path }) {
  const rad = Math.atan2(
    (path.p2.y - path.p1.y) * (isLeftTop ? -1 : 1),
    (path.p2.x - path.p1.x) * (isLeftTop ? -1 : 1)
  );

  const snap = {
    x: Math.cos(rad) * SNAP_LENGTH,
    y: Math.sin(rad) * SNAP_LENGTH,
  };
  const moving = isLeftTop ? path.p1 : path.p2;

  const snapLine = {
    p1: { x: moving.x + snap.x, y: moving.y + snap.y },
    p2: { x: moving.x - snap.x, y: moving.y - snap.y },
  };
  const pathInfo = ShapeInfo.line(snapLine);

  let shapeInfo;
  if (shapeType === SHAPE_TYPES.RECT.name) {
    shapeInfo = ShapeInfo.rectangle({
      top: shape.p1.y,
      left: shape.p1.x,
      width: getWidthHeight(shape).w,
      height: getWidthHeight(shape).h,
    });
  }
  if (shapeType === SHAPE_TYPES.ELLIPSE.name) {
    shapeInfo = ShapeInfo.ellipse({
      centerX: getCenterPoint(shape).x,
      centerY: getCenterPoint(shape).y,
      radiusX: getWidthHeight(shape).w / 2,
      radiusY: getWidthHeight(shape).h / 2,
    });
  }
  const intersection = Intersection.intersect(pathInfo, shapeInfo);
  const sorted = intersection.points.sort(
    (p1, p2) =>
      (p1.x - moving.x) * (p1.x - moving.x) +
      (p1.y - moving.y) * (p1.y - moving.y) -
      ((p2.x - moving.x) * (p2.x - moving.x) +
        (p2.y - moving.y) * (p2.y - moving.y))
  );
  return sorted;
}

export { getLineIntersection };

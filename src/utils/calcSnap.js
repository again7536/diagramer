import { ShapeInfo, Intersection } from "kld-intersections";
import { SHAPE_TYPES } from "../constants";
import { getCenterPoint, getWidthHeight } from "./calcPoint";

const SNAP_LENGTH = 30;

function snapLine({ shape, shapeType, isXMoved, path }) {
  const rad = Math.atan2(
    (path.p2.y - path.p1.y) * (isXMoved ? -1 : 1),
    (path.p2.x - path.p1.x) * (isXMoved ? -1 : 1)
  );

  const snap = {
    x: Math.cos(rad) * SNAP_LENGTH,
    y: Math.sin(rad) * SNAP_LENGTH,
  };
  const origin = isXMoved ? path.p1 : path.p2;

  const snapLine = {
    p1: { x: origin.x + snap.x, y: origin.y + snap.y },
    p2: { x: origin.x - snap.x, y: origin.y - snap.y },
  };
  const pathInfo = ShapeInfo.line(snapLine);

  let shapeInfo;
  if (shapeType === SHAPE_TYPES.RECT) {
    shapeInfo = ShapeInfo.rectangle({
      top: shape.p1.y,
      left: shape.p1.x,
      width: getWidthHeight(shape).w,
      height: getWidthHeight(shape).h,
    });
  }
  if (shapeType === SHAPE_TYPES.ELLIPSE) {
    shapeInfo = ShapeInfo.ellipse({
      centerX: getCenterPoint(shape).x,
      centerY: getCenterPoint(shape).y,
      radiusX: getWidthHeight(shape).w / 2,
      radiusY: getWidthHeight(shape).h / 2,
    });
  }
  const intersection = Intersection.intersect(pathInfo, shapeInfo);
  return intersection.points;
}

export { snapLine };

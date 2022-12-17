import { ShapeInfo, Intersection } from "kld-intersections";
const SNAP_LENGTH = 30;

function snapLine({ shape, shapeType, isXMoved, path }) {
  const rad = Math.atan2(
    (path.height - path.y) * (isXMoved ? -1 : 1),
    (path.width - path.x) * (isXMoved ? -1 : 1)
  );

  const snapX = Math.cos(rad) * SNAP_LENGTH;
  const snapY = Math.sin(rad) * SNAP_LENGTH;
  const originX = isXMoved ? path.x : path.width;
  const originY = isXMoved ? path.y : path.height;
  const snapLine = {
    p1: { x: originX + snapX, y: originY + snapY },
    p2: { x: originX - snapX, y: originY - snapY },
  };
  const pathInfo = ShapeInfo.line(snapLine);

  if (shapeType === "rect") {
    const shapeInfo = ShapeInfo.rectangle({
      top: shape.y,
      left: shape.x,
      width: shape.width,
      height: shape.height,
    });

    const intersection = Intersection.intersect(pathInfo, shapeInfo);
    return intersection.points;
  }
}

export { snapLine };

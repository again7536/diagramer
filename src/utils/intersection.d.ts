import { Area, ShapeType } from "../types";

export declare function getLineIntersection({
  shape,
  path,
  shapeType,
  isLeftTop,
}: {
  shape: Area;
  path: Area;
  shapeType: ShapeType;
  isLeftTop: boolean;
}): { x: number; y: number }[];

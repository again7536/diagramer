import { Area, ShapeType } from "../types";

export declare function snapLine({
  shape,
  path,
  shapeType,
  isXMoved,
}: {
  shape: Area;
  path: Area;
  shapeType: ShapeType;
  isXMoved: boolean;
}): { x: number; y: number }[];

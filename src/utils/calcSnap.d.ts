import { Dimension, ShapeType } from "../types";

export declare function snapLine({
  shape,
  shapeType,
  path,
  isXMoved,
}: {
  shape: Dimension;
  shapeType: ShapeType;
  path: Dimension;
  isXMoved: boolean;
}): { x: number; y: number }[];

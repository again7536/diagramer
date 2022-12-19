import { Matrix } from "transformation-matrix";

type ShapeType = "rect" | "line" | "ellipse";

interface Area {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
}

interface ShapeState {
  id: string;
  type: ShapeType;
  cur: Area;
  prev: Area;
  snapped: { [id: string]: number };
  css?: string;
}

interface RectState extends ShapeState {}

export { ShapeState, RectState, ShapeType, Area };

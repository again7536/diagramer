import { Matrix } from "transformation-matrix";

type ShapeType = "rect" | "line" | "ellipse" | "g";

interface Area {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
}

interface ShapeState {
  id: string;
  type: ShapeType;
  cur: Matrix;
  prev: Matrix;
  children: (() => ShapeState)[];
  parent: (() => ShapeState) | null;
  snapping: { [idx: number]: string };
  snapped: { [id: string]: number };
  css?: string;
}

type Snap = {
  [id: string]:
    | {
        snapping: { [idx: number]: string };
        snapped: { [id: string]: number };
      }
    | undefined;
};

interface RectState extends ShapeState {}

export { ShapeState, RectState, ShapeType, Area };

import { Matrix } from "transformation-matrix";

type ShapeType = "rect" | "line" | "ellipse" | "g";

interface Area {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
}

interface ShapeState {
  id: string;
  type: ShapeType;
  cur: Area;
  prev: Area;
  children: ShapeState[];
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

export { ShapeState, RectState, ShapeType, Snap, Area };

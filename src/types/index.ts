type ShapeType = "rect" | "line" | "circle";

interface ShapeState {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  css?: string;
}

interface RectState extends ShapeState {}

export { ShapeState, RectState, ShapeType };

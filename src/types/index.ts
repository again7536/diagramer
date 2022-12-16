type ShapeType = "rect" | "line" | "circle";

interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface ShapeState {
  id: string;
  type: ShapeType;
  cur: Dimension;
  prev: Dimension;
  css?: string;
}

interface RectState extends ShapeState {}

export { ShapeState, RectState, ShapeType, Dimension };

interface ShapeState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  css?: string;
}

interface RectState extends ShapeState {}

export { ShapeState, RectState };

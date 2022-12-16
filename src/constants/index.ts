import { ShapeType } from "../types";

const CIRCLE_CONFIG = [
  {
    x: 0,
    y: 0,
    cursor: "nw-resize",
    resize: { dwidth: -1, dheight: -1, dx: 1, dy: 1 },
  },
  {
    x: 0.5,
    y: 0,
    cursor: "n-resize",
    resize: { dwidth: 0, dheight: -1, dx: 0, dy: 1 },
  },
  {
    x: 1,
    y: 0,
    cursor: "ne-resize",
    resize: { dwidth: 1, dheight: -1, dx: 0, dy: 1 },
  },
  {
    x: 1,
    y: 0.5,
    cursor: "e-resize",
    resize: { dwidth: 1, dheight: 0, dx: 0, dy: 0 },
  },
  {
    x: 1,
    y: 1,
    cursor: "se-resize",
    resize: { dwidth: 1, dheight: 1, dx: 0, dy: 0 },
  },
  {
    x: 0.5,
    y: 1,
    cursor: "s-resize",
    resize: { dwidth: 0, dheight: 1, dx: 0, dy: 0 },
  },
  {
    x: 0,
    y: 1,
    cursor: "sw-resize",
    resize: { dwidth: -1, dheight: 1, dx: 1, dy: 0 },
  },
  {
    x: 0,
    y: 0.5,
    cursor: "w-resize",
    resize: { dwidth: -1, dheight: 0, dx: 1, dy: 0 },
  },
];

const SHAPE_TYPES: { [key: string]: ShapeType } = {
  RECT: "rect",
  LINE: "line",
  CIRCLE: "circle",
};
export { CIRCLE_CONFIG, SHAPE_TYPES };

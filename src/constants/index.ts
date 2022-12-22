import { ShapeType } from "../types";

const RESIZE_CIRCLE_CONFIG = [
  {
    x: 0,
    y: 0,
    cursor: "nw-resize",
    resize: { p1: { x: 1, y: 1 }, p2: { x: -1, y: -1 } },
  },
  {
    x: 0.5,
    y: 0,
    cursor: "n-resize",
    resize: { p1: { x: 0, y: 1 }, p2: { x: 0, y: -1 } },
  },
  {
    x: 1,
    y: 0,
    cursor: "ne-resize",
    resize: { p1: { x: 0, y: 1 }, p2: { x: 1, y: -1 } },
  },
  {
    x: 1,
    y: 0.5,
    cursor: "e-resize",
    resize: { p1: { x: 0, y: 0 }, p2: { x: 1, y: 0 } },
  },
  {
    x: 1,
    y: 1,
    cursor: "se-resize",
    resize: { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } },
  },
  {
    x: 0.5,
    y: 1,
    cursor: "s-resize",
    resize: { p1: { x: 0, y: 0 }, p2: { x: 0, y: 1 } },
  },
  {
    x: 0,
    y: 1,
    cursor: "sw-resize",
    resize: { p1: { x: 1, y: 0 }, p2: { x: -1, y: 1 } },
  },
  {
    x: 0,
    y: 0.5,
    cursor: "w-resize",
    resize: { p1: { x: 1, y: 0 }, p2: { x: -1, y: 0 } },
  },
];

const LINE_RESIZE_CIRCLE_CONFIG = [
  {
    cursor: "w-resize",
    resize: { p1: { x: 1, y: 1 }, p2: { x: 0, y: 0 } },
  },
  { cursor: "e-resize", resize: { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } } },
];

const SHAPE_TYPES: { [key: string]: { name: ShapeType; icon: string } } = {
  RECT: { name: "rect", icon: "fa-solid fa-square" },
  LINE: { name: "line", icon: "fa-solid fa-minus" },
  ELLIPSE: { name: "ellipse", icon: "fa-solid fa-circle" },
  GROUP: { name: "g", icon: "fa-solid fa-object-group" },
};

const TREE_ROOT_ID = "root";
const TREE_ROOT_IDX = 0;
const TREE_ROOT = {
  id: TREE_ROOT_ID,
  cur: { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } },
  prev: { p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } },
  children: [],
  parent: null,
  type: SHAPE_TYPES.GROUP.name,
};

export {
  RESIZE_CIRCLE_CONFIG,
  LINE_RESIZE_CIRCLE_CONFIG,
  SHAPE_TYPES,
  TREE_ROOT_ID,
  TREE_ROOT_IDX,
  TREE_ROOT,
};

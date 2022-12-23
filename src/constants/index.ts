import { identity } from "transformation-matrix";
import { ShapeType } from "../types";

const DIR = {
  TOP_LEFT: { x: -1, y: -1 },
  TOP: { x: 0, y: -1 },
  TOP_RIGHT: { x: 1, y: -1 },
  RIGHT: { x: 1, y: 0 },
  BOTTOM_RIGHT: { x: 1, y: 1 },
  BOTTOM: { x: 0, y: 1 },
  BOTTOM_LEFT: { x: -1, y: 1 },
  LEFT: { x: -1, y: 0 },
};

const RESIZE_CIRCLE_CONFIG = [
  {
    ...DIR.TOP_LEFT,
    cursor: "nw-resize",
    resize: { to: DIR.TOP_LEFT, origin: DIR.BOTTOM_RIGHT },
  },
  {
    ...DIR.TOP,
    cursor: "n-resize",
    resize: { to: DIR.TOP, origin: DIR.BOTTOM },
  },
  {
    ...DIR.TOP_RIGHT,
    cursor: "ne-resize",
    resize: { to: DIR.TOP_RIGHT, origin: DIR.BOTTOM_LEFT },
  },
  {
    ...DIR.RIGHT,
    cursor: "e-resize",
    resize: { to: DIR.RIGHT, origin: DIR.LEFT },
  },
  {
    ...DIR.BOTTOM_RIGHT,
    cursor: "se-resize",
    resize: { to: DIR.BOTTOM_RIGHT, origin: DIR.TOP_LEFT },
  },
  {
    ...DIR.BOTTOM,
    cursor: "s-resize",
    resize: { to: DIR.BOTTOM, origin: DIR.TOP },
  },
  {
    ...DIR.BOTTOM_LEFT,
    cursor: "sw-resize",
    resize: { to: DIR.BOTTOM_LEFT, origin: DIR.TOP_RIGHT },
  },
  {
    ...DIR.LEFT,
    cursor: "w-resize",
    resize: { to: DIR.LEFT, origin: DIR.RIGHT },
  },
];

const LINE_RESIZE_CIRCLE_CONFIG = [
  {
    cursor: "w-resize",
    resize: { to: DIR.TOP_LEFT, origin: DIR.BOTTOM_RIGHT },
  },
  {
    cursor: "e-resize",
    resize: { to: DIR.BOTTOM_RIGHT, origin: DIR.TOP_LEFT },
  },
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
  cur: identity(),
  prev: identity(),
  children: [],
  parent: null,
  snapping: {},
  snapped: {},
  type: SHAPE_TYPES.GROUP.name,
};

export {
  DIR,
  RESIZE_CIRCLE_CONFIG,
  LINE_RESIZE_CIRCLE_CONFIG,
  SHAPE_TYPES,
  TREE_ROOT_ID,
  TREE_ROOT_IDX,
  TREE_ROOT,
};

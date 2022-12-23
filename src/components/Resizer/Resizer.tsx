import { createMemo, Index } from "solid-js";
import { ShapeState } from "../../types";
import { RESIZE_CIRCLE_CONFIG } from "../../constants";
import { getWidthHeight } from "../../utils";
import {
  decomposeTSR,
  scale,
  toCSS,
  compose,
  applyToPoint,
} from "transformation-matrix";

interface ResizerProps extends ShapeState {
  scale: number;
}

const CIRCLE_COUNT = 8;

const Resizer = (props: ResizerProps) => {
  const idxArr = createMemo(() =>
    Array.from({ length: CIRCLE_COUNT }, (v, i) => i)
  );

  return (
    <g>
      <Index each={idxArr()}>
        {(i) => (
          <circle
            class={`resizer-${i()}`}
            cx={applyToPoint(props.cur, RESIZE_CIRCLE_CONFIG[i()]).x}
            cy={applyToPoint(props.cur, RESIZE_CIRCLE_CONFIG[i()]).y}
            r={3 / props.scale}
            fill="blue"
            stroke="skyblue"
            stroke-width={3 / props.scale}
            style={{ cursor: RESIZE_CIRCLE_CONFIG[i()].cursor }}
          />
        )}
      </Index>
    </g>
  );
};

export default Resizer;

import { createMemo, Index } from "solid-js";
import { ShapeState } from "../../types";
import { RESIZE_CIRCLE_CONFIG } from "../../constants";
import { getWidthHeight } from "../../utils";

interface ResizerProps extends ShapeState {}

const CIRCLE_COUNT = 8;

const Resizer = (props: ResizerProps) => {
  const idxArr = createMemo(() =>
    Array.from({ length: CIRCLE_COUNT }, (v, i) => i)
  );

  return (
    <g transform={`translate(${props.cur.p1.x}, ${props.cur.p1.y})`}>
      <Index each={idxArr()}>
        {(i) => (
          <circle
            class={`resizer-${i()}`}
            cx={getWidthHeight(props.cur).w * RESIZE_CIRCLE_CONFIG[i()].x}
            cy={getWidthHeight(props.cur).h * RESIZE_CIRCLE_CONFIG[i()].y}
            r={3}
            fill="blue"
            stroke="skyblue"
            stroke-width={3}
            style={{ cursor: RESIZE_CIRCLE_CONFIG[i()].cursor }}
          />
        )}
      </Index>
    </g>
  );
};

export default Resizer;

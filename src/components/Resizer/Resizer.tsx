import { createMemo, Index } from "solid-js";
import { ShapeState } from "../../types";
import { RESIZE_CIRCLE_CONFIG } from "../../constants";

interface ResizerProps extends ShapeState {}

const CIRCLE_COUNT = 8;

const Resizer = (props: ResizerProps) => {
  const idxArr = createMemo(() =>
    Array.from({ length: CIRCLE_COUNT }, (v, i) => i)
  );

  return (
    <g transform={`translate(${props.cur.x}, ${props.cur.y})`}>
      <Index each={idxArr()}>
        {(i) => (
          <circle
            class={`resizer-${i()}`}
            cx={props.cur.width * RESIZE_CIRCLE_CONFIG[i()].x}
            cy={props.cur.height * RESIZE_CIRCLE_CONFIG[i()].y}
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

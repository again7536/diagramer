import { createSignal, For } from "solid-js";
import { ShapeState } from "../../types";
import { CIRCLE_CONFIG } from "../../constants";

interface ResizerProps extends ShapeState {}

const CIRCLE_COUNT = 8;

const Resizer = (props: ResizerProps) => {
  return (
    <g transform={`translate(${props.x}, ${props.y})`}>
      <For each={Array.from({ length: CIRCLE_COUNT }, (v, i) => i)}>
        {(i) => (
          <circle
            class={`resizer-${i}`}
            cx={props.width * CIRCLE_CONFIG[i].x}
            cy={props.height * CIRCLE_CONFIG[i].y}
            r={3}
            fill="blue"
            stroke="skyblue"
            stroke-width={3}
            style={{ cursor: CIRCLE_CONFIG[i].cursor }}
          />
        )}
      </For>
    </g>
  );
};

export default Resizer;

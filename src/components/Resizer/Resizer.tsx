import { createSignal, For } from "solid-js";
import { ShapeState } from "../../types";

interface ResizerProps extends ShapeState {
  onResize: (size: Pick<ShapeState, "x" | "y" | "width" | "height">) => void;
}

const CIRCLE_COUNT = 8;

const Resizer = (props: ResizerProps) => {
  const [start, setStart] = createSignal<{
    x: number;
    y: number;
    isResize: boolean;
  }>({
    x: 0,
    y: 0,
    isResize: false,
  });
  const CIRCLE_CONFIG = [
    {
      x: 0,
      y: 0,
      cursor: "nw-resize",
      resizeHandler: (e: MouseEvent) => {
        if (start().isResize)
          props.onResize({
            x: e.clientX - start().x + props.x,
            y: e.clientY - start().y + props.y,
            width: -(e.clientX - start().x) + props.width,
            height: -(e.clientY - start().y) + props.height,
          });
      },
    },
    { x: 0.5, y: 0, cursor: "n-resize" },
    { x: 1, y: 0, cursor: "ne-resize" },
    { x: 1, y: 0.5, cursor: "e-resize" },
    { x: 1, y: 1, cursor: "se-resize" },
    { x: 0.5, y: 1, cursor: "s-resize" },
    { x: 0, y: 1, cursor: "sw-resize" },
    { x: 0, y: 0.5, cursor: "w-resize" },
  ];

  const handleMouseDown = (e: MouseEvent) =>
    setStart({ x: e.clientX, y: e.clientY, isResize: true });
  const handleMouseUp = () =>
    setStart((prev) => ({ ...prev, isResize: false }));

  return (
    <g transform={`translate(${props.x}, ${props.y})`}>
      <For each={Array.from({ length: CIRCLE_COUNT }, (v, i) => i)}>
        {(i) => (
          <circle
            cx={props.width * CIRCLE_CONFIG[i].x}
            cy={props.height * CIRCLE_CONFIG[i].y}
            r={3}
            fill="blue"
            stroke="skyblue"
            stroke-width={3}
            style={{ cursor: CIRCLE_CONFIG[i].cursor }}
            onmousedown={handleMouseDown}
            onmousemove={CIRCLE_CONFIG[i].resizeHandler ?? undefined}
            onmouseup={handleMouseUp}
          />
        )}
      </For>
    </g>
  );
};

export default Resizer;

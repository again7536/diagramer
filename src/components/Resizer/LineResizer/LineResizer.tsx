import { createMemo } from "solid-js";
import { applyToPoint } from "transformation-matrix";
import { DIR, LINE_RESIZE_CIRCLE_CONFIG } from "../../../constants";
import { ShapeState } from "../../../types";

interface LineResizerProps extends ShapeState {
  scale: number;
}

const LineResizer = (props: LineResizerProps) => {
  const topLeft = createMemo(() => applyToPoint(props.cur, DIR.TOP_LEFT));
  const bottomRight = createMemo(() =>
    applyToPoint(props.cur, DIR.BOTTOM_RIGHT)
  );

  return (
    <>
      <circle
        class="resizer-0"
        cursor={LINE_RESIZE_CIRCLE_CONFIG[0].cursor}
        cx={topLeft().x}
        cy={topLeft().y}
        r={3 / props.scale}
        fill="blue"
        stroke="skyblue"
        stroke-width={3 / props.scale}
      ></circle>
      <circle
        class="resizer-1"
        cursor={LINE_RESIZE_CIRCLE_CONFIG[1].cursor}
        cx={bottomRight().x}
        cy={bottomRight().y}
        r={3 / props.scale}
        fill="blue"
        stroke="skyblue"
        stroke-width={3 / props.scale}
      ></circle>
    </>
  );
};

export default LineResizer;

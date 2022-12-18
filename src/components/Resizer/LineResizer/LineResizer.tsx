import { LINE_RESIZE_CIRCLE_CONFIG } from "../../../constants";
import { ShapeState } from "../../../types";

interface LineResizerProps extends ShapeState {}

const LineResizer = (props: LineResizerProps) => {
  return (
    <>
      <circle
        class="resizer-0"
        cursor={LINE_RESIZE_CIRCLE_CONFIG[0].cursor}
        cx={props.cur.p1.x}
        cy={props.cur.p1.y}
        r={3}
        fill="blue"
        stroke="skyblue"
        stroke-width={3}
      ></circle>
      <circle
        class="resizer-1"
        cursor={LINE_RESIZE_CIRCLE_CONFIG[1].cursor}
        cx={props.cur.p2.x}
        cy={props.cur.p2.y}
        r={3}
        fill="blue"
        stroke="skyblue"
        stroke-width={3}
      ></circle>
    </>
  );
};

export default LineResizer;

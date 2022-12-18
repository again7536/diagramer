import { RectState } from "../../../types";
import { getWidthHeight } from "../../../utils";

interface RectProps extends RectState {}

const Rect = (props: RectProps) => {
  return (
    <rect
      id={props.id}
      class="shape"
      width={getWidthHeight(props.cur).w}
      height={getWidthHeight(props.cur).h}
      // x={props.cur.x}
      // y={props.cur.y}
      transform={`translate(${props.cur.p1.x}, ${props.cur.p1.y})`}
      style={props.css ?? undefined}
    />
  );
};

export default Rect;

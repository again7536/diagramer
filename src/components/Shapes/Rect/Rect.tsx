import { toCSS } from "transformation-matrix";
import { RectState } from "../../../types";
import { getWidthHeight } from "../../../utils";

interface RectProps extends RectState {}

const Rect = (props: RectProps) => {
  return (
    <rect
      id={props.id}
      class="shape"
      width={2}
      height={2}
      x={-1}
      y={-1}
      transform={toCSS(props.cur)}
      style={props.css ?? undefined}
    />
  );
};

export default Rect;

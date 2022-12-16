import { RectState } from "../../../types";

interface RectProps extends RectState {}

const Rect = (props: RectProps) => {
  return (
    <rect
      id={props.id}
      class="shape"
      width={props.cur.width}
      height={props.cur.height}
      transform={`translate(${props.cur.x}, ${props.cur.y})`}
      style={props.css ?? undefined}
    />
  );
};

export default Rect;

import { RectState } from "../../types";

interface RectProps extends RectState {}

const Rect = (props: RectProps) => {
  return (
    <rect
      id={props.id}
      class="shape"
      width={props.width}
      height={props.height}
      transform={`translate(${props.x}, ${props.y})`}
      style={props.css ?? undefined}
    />
  );
};

export default Rect;

import { ShapeState } from "../../../types";

interface LineProps extends ShapeState {}

const Line = (props: LineProps) => {
  return (
    <path
      id={props.id}
      d={`M${props.x} ${props.y} l${props.width} ${props.height}`}
      class="shape"
      stroke="black"
      style={props.css}
    ></path>
  );
};

export default Line;

import { ShapeState } from "../../../types";

interface CircleProps extends ShapeState {}

const Circle = (props: CircleProps) => {
  return (
    <ellipse
      id={props.id}
      class="shape"
      style={props.css}
      cx={props.x + props.width / 2}
      cy={props.y + props.height / 2}
      rx={props.width / 2}
      ry={props.height / 2}
    ></ellipse>
  );
};

export default Circle;

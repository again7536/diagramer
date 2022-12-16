import { ShapeState } from "../../../types";

interface LineProps extends ShapeState {}

const Line = (props: LineProps) => {
  return (
    <path
      id={props.id}
      d={`M${props.cur.x} ${props.cur.y} L${props.cur.width} ${props.cur.height}`}
      class="shape"
      stroke="black"
      style={props.css}
    ></path>
  );
};

export default Line;

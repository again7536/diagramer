import { ShapeState } from "../../../types";

interface LineProps extends ShapeState {}

const Line = (props: LineProps) => {
  return (
    <line
      id={props.id}
      x1={props.cur.x}
      y1={props.cur.y}
      x2={props.cur.width}
      y2={props.cur.height}
      class="shape"
      stroke="black"
      style={props.css}
    />
  );
};

export default Line;
